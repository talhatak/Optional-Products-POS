from odoo import api, models
from odoo.osv import expression


class ProductProduct(models.Model):
    _inherit = 'product.product'

    @api.model
    def _load_pos_data_fields(self, config_id):
        return list(dict.fromkeys([
            *super()._load_pos_data_fields(config_id),
            'pos_optional_products_ids',
        ]))

    def _load_pos_data(self, data):
        result = super()._load_pos_data(data)
        products = result['data']
        optional_template_ids = {
            template_id
            for product in products
            for template_id in product.get('pos_optional_products_ids', [])
        }
        if not optional_template_ids:
            return result

        # Include suggestions even when the initial product load is limited,
        # while respecting the POS company's and category restrictions.
        config = self.env['pos.config'].browse(data['pos.config']['data'][0]['id'])
        domain = expression.AND([
            config._get_available_product_domain(),
            [
                ('product_tmpl_id', 'in', list(optional_template_ids)),
                ('id', 'not in', [product['id'] for product in products]),
            ],
        ])
        optional_products = self._load_product_with_domain(domain, config.id)
        self._process_pos_ui_product_product(optional_products, config)
        products.extend(optional_products)
        return result
