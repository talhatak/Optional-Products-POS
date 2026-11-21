# -*- coding: utf-8 -*-
# Copyright 2026 Talha Khan
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.html).
{
    'name': 'POS Optional Products',
    'version': '18.0.1.0.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Suggest optional products in a popup after adding a POS item',
    'description': """Configure optional products on the product's Point of Sale
    tab. After the main product is added to the cart, cashiers can select
    suggested products in a category-grouped popup or skip the suggestions.
    Selected products use standard POS pricing and product configuration.
    """,
    'author': 'Talha Khan',
    'maintainer': 'Talha Khan',
    'depends': ['point_of_sale'],
    'data': ['views/product_template_views.xml'],
    'assets': {
        'point_of_sale._assets_pos': [
            'optional_products_pos/static/src/js/optional_product_popup.js',
            'optional_products_pos/static/src/js/pos_store.js',
            'optional_products_pos/static/src/xml/optional_product_popup.xml',
            'optional_products_pos/static/src/scss/optional_product_popup.scss',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
    'application': True,
}
