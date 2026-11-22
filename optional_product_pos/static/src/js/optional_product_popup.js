/** @odoo-module **/

import { useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";

export class OptionalProductPopup extends AbstractAwaitablePopup {
    static template = "optional_product_pos.OptionalProductPopup";
    static props = {
        categories: Array,
        title: String,
        id: Number,
        zIndex: Number,
        close: Function,
        resolve: Function,
        cancelKey: String,
        confirmKey: String,
    };
    static defaultProps = {
        title: _t("Optional Products"),
    };

    setup() {
        super.setup(...arguments);
        this.state = useState({ selectedIds: new Set() });
    }

    toggleProduct(product) {
        if (this.state.selectedIds.has(product.id)) {
            this.state.selectedIds.delete(product.id);
        } else {
            this.state.selectedIds.add(product.id);
        }
    }

    getPayload() {
        return this.props.categories
            .flatMap((category) => category.products)
            .filter((product) => this.state.selectedIds.has(product.id));
    }
}
