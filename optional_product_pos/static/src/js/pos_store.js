/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { OptionalProductPopup } from "./optional_product_popup";

patch(PosStore.prototype, {
    async addProductFromUi(product, options = {}) {
        // Odoo 17 calls this after configuration, lots, and weighing succeed.
        const line = await super.addProductFromUi(...arguments);
        const order = line?.order;
        if (
            !line ||
            !order ||
            order.finalized ||
            options.skipOptionalProducts ||
            options.comboParent ||
            options.refunded_orderline_id ||
            (options.quantity ?? 1) <= 0
        ) {
            return line;
        }

        const addedProduct = line.get_product();
        const templateIds = new Set(addedProduct.pos_optional_product_ids || []);
        templateIds.delete(addedProduct.product_tmpl_id);
        if (!templateIds.size) {
            return line;
        }

        const categories = new Map();
        const seenTemplates = new Set();
        for (const candidate of Object.values(this.db.product_by_id)) {
            const templateId = candidate.product_tmpl_id;
            if (
                !templateIds.has(templateId) ||
                seenTemplates.has(templateId) ||
                !candidate.active ||
                !candidate.available_in_pos ||
                this.db.product_ids_to_not_display.includes(candidate.id)
            ) {
                continue;
            }
            seenTemplates.add(templateId);
            const category = this.db.category_by_id[candidate.pos_categ_ids[0]];
            const categoryId = category?.id || 0;
            if (!categories.has(categoryId)) {
                categories.set(categoryId, {
                    id: categoryId,
                    name: category?.name || _t("Other Products"),
                    sequence: category?.sequence ?? Number.MAX_SAFE_INTEGER,
                    products: [],
                });
            }
            categories.get(categoryId).products.push(candidate);
        }
        if (!categories.size) {
            return line;
        }

        const sortedCategories = [...categories.values()].sort(
            (a, b) => a.sequence - b.sequence || a.name.localeCompare(b.name)
        );
        for (const category of sortedCategories) {
            category.products.sort((a, b) => a.display_name.localeCompare(b.display_name));
        }

        const { confirmed, payload } = await this.popup.add(OptionalProductPopup, {
            categories: sortedCategories,
        });
        if (confirmed && payload) {
            for (const optionalProduct of payload) {
                if (this.get_order() !== order || order.finalized) {
                    break;
                }
                // Gather standard options first. Passing our skip flag into
                // addProductToCurrentOrder would mask a cancelled configurator
                // in Odoo 17, because that method merges options after cancel.
                const productOptions = await optionalProduct.getAddProductOptions();
                if (!productOptions) {
                    continue;
                }
                if (this.get_order() !== order || order.finalized) {
                    break;
                }
                const optionalLine = await this.addProductFromUi(optionalProduct, {
                    ...productOptions,
                    skipOptionalProducts: true,
                });
                if (optionalLine && optionalProduct.tracking === "serial") {
                    order.get_selected_orderline()?.set_quantity_by_lot();
                }
                this.numberBuffer.reset();
            }
        }
        // The Odoo 17 caller applies serial quantities to the selected line
        // after this method returns, so keep it on the main serial product.
        if (
            addedProduct.tracking === "serial" &&
            this.get_order() === order &&
            !order.finalized &&
            order.get_orderlines().includes(line)
        ) {
            order.select_orderline(line);
        }
        return line;
    },
});
