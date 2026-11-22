POS Optional Products
=====================

Standalone addon for Odoo 17. Depends only on Point of Sale.

Setup
-----

1. Install ``POS Optional Products`` from Apps.
2. Open a product, enable Point of Sale, and open the Point of Sale section
   of its Sales tab.
3. Select products in ``Optional Products`` and save.
4. Reopen the POS so it loads the updated suggestions.
5. Add the main product. Select extras in the popup and click Add Selected,
   or use Cancel/the close button to keep the main product without extras.

Behavior
--------

* Suggestions are grouped by their first POS category. Products without a
  category appear under Other Products.
* The main item remains in the cart when the popup is skipped.
* Selected extras are added with quantity one through standard Odoo POS
  configuration and pricing. Existing identical lines may merge normally.
* Extras do not trigger nested optional-product popups.
* Configuration is shared by all variants of the main product. Each optional
  template appears once; Odoo's standard configurator handles its attributes.
* Only active, sellable products available to the current POS company and
  allowed POS categories are loaded. Suggestions are preloaded, including
  when initial product loading is limited, so opening the popup needs no RPC.
* Optional products are suggestions, not components, free items, or combo lines.
  Changing/removing a main item does not change previously added extras.

Version compatibility
---------------------

This branch targets Odoo 17 and uses its POS session loaders and awaitable
popup service. The technical addon name is ``optional_product_pos``. Add the
repository directory to your addons path so Odoo can discover that subfolder.
The configuration field is ``pos_optional_product_ids`` and uses the existing
``optional_products_pos_template_rel`` relation table.

This is a separate Odoo-version build, not a database downgrade. Do not run an
Odoo 18 database on Odoo 17. Only source-level checks have been performed for
this port; installation and a full POS browser check on Odoo 17 remain pending.

Author and license
------------------

Author: Talha Khan
License: GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later).
See ``LICENSE`` for the LGPL-3 terms and ``COPYING`` for the incorporated
GPL-3 terms.

Store description
-----------------

The Odoo Apps description, icon, and screenshots are in
``optional_product_pos/static/description``.
The included screenshots illustrate the Odoo 18 edition. Odoo 17 places the
configuration under Sales > Point of Sale and uses its native popup framework;
the appearance may differ. Sample products are not installed by this addon.
