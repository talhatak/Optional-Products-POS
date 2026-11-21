from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    pos_optional_products_ids = fields.Many2many(
        comodel_name='product.template',
        relation='optional_products_pos_template_rel',
        column1='product_tmpl_id',
        column2='optional_product_tmpl_id',
        string='Optional Products',
        domain="[('available_in_pos', '=', True), ('sale_ok', '=', True)]",
        help='Suggest these products after adding this product to the POS cart. '
             'Only products available to the current POS are shown. '
             'Reopen the POS after changing these suggestions.',
    )
