/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { OptionalProductPopup } from "./optional_product_popup";

patch(PosStore.prototype, {
    async addLineToOrder(vals, order, opts = {}, configure = true) {
        const line = await super.addLineToOrder(...arguments);
        if (
            !line ||
            !configure ||
            opts.skipOptionalProducts ||
            (vals.qty ?? 1) <= 0 ||
            vals.refunded_orderline_id
        ) {
            return line;
        }

        // Raw IDs survive even if a related template is not loaded in this POS.
        const product = line.product_id;
        const templateIds = new Set(product.raw.pos_optional_product_ids || []);
        templateIds.delete(product.product_tmpl_id.id);
        if (!templateIds.size) {
            return line;
        }

        const categories = new Map();
        const seenTemplates = new Set();
        for (const candidate of this.models["product.product"].getAll()) {
            const templateId = candidate.product_tmpl_id.id;
            if (
                !templateIds.has(templateId) ||
                seenTemplates.has(templateId) ||
                !candidate.active ||
                !candidate.available_in_pos ||
                this.hiddenProductIds.has(candidate.id)
            ) {
                continue;
            }
            seenTemplates.add(templateId);
            const category = candidate.pos_categ_ids[0];
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

        const selectedProducts = await makeAwaitable(this.dialog, OptionalProductPopup, {
            categories: sortedCategories,
        });
        if (selectedProducts && this.get_order() === order && !order.finalized) {
            for (const optionalProduct of selectedProducts) {
                await this.addLineToOrder(
                    { product_id: optionalProduct },
                    order,
                    { skipOptionalProducts: true },
                    true
                );
            }
        }
        return line;
    },
});
