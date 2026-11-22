/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { _t } from "@web/core/l10n/translation";

export class OptionalProductPopup extends Component {
    static template = "optional_product_pos.OptionalProductPopup";
    static components = { Dialog };
    static props = {
        categories: Array,
        getPayload: Function,
        close: Function,
    };

    setup() {
        this.title = _t("Optional Products");
        this.state = useState({ selectedIds: new Set() });
    }

    toggleProduct(product) {
        if (this.state.selectedIds.has(product.id)) {
            this.state.selectedIds.delete(product.id);
        } else {
            this.state.selectedIds.add(product.id);
        }
    }

    confirm() {
        const products = this.props.categories.flatMap((category) => category.products);
        this.props.getPayload(products.filter((product) => this.state.selectedIds.has(product.id)));
        this.props.close();
    }

    cancel() {
        this.props.getPayload();
        this.props.close();
    }
}
