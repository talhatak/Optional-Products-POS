from odoo import models
from odoo.osv import expression


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        params = super()._loader_params_product_product()
        params['search_params']['fields'] = list(dict.fromkeys([
            *params['search_params']['fields'],
            'pos_optional_product_ids',
        ]))
        return params

    def _loader_params_pos_category(self):
        params = super()._loader_params_pos_category()
        params['search_params']['fields'] = list(dict.fromkeys([
            *params['search_params']['fields'],
            'sequence',
        ]))
        return params

    def _get_pos_ui_product_product(self, params):
        products = super()._get_pos_ui_product_product(params)
        optional_template_ids = {
            template_id
            for product in products
            for template_id in product.get('pos_optional_product_ids', [])
        }
        if not optional_template_ids:
            return products

        # Include suggestions in limited product loads without bypassing the
        # current POS company's or category restrictions.
        domain = expression.AND([
            self.config_id._get_available_product_domain(),
            [
                ('active', '=', True),
                ('product_tmpl_id', 'in', list(optional_template_ids)),
                ('id', 'not in', [product['id'] for product in products]),
            ],
        ])
        session = self.with_context(**params.get('context', {}))
        optional_products = session.env['product.product'].search_read(
            domain=domain,
            fields=params['search_params']['fields'],
            order=params['search_params'].get('order', 'id'),
        )
        session._process_pos_ui_product_product(optional_products)
        products.extend(optional_products)
        return products
