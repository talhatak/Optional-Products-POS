POS Optional Products
=====================

Standalone addon for Odoo 18. Depends only on Point of Sale.

Setup
-----

1. Install ``POS Optional Products`` from Apps.
2. Open a product, enable Point of Sale, and open its Point of Sale tab.
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

Independence
------------

Author: Talha Khan
License: GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later).
See ``LICENSE`` for the LGPL-3 terms and ``COPYING`` for the incorporated
GPL-3 terms.

Store description
-----------------

The Odoo Apps description, icon, and screenshots are in ``static/description``.
Screenshots show demonstration records in Odoo 18. Sample products are not
installed by this addon.
