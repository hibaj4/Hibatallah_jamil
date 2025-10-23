# -*- coding: utf-8 -*-
# Script pour exécuter le TP2 Odoo automatiquement
# À lancer dans le shell Odoo : ./odoo-bin shell -d nom_de_ta_base

# 1. Créer la société (ou utiliser celle existante)
company = env['res.company'].create({
    'name': 'MyCompany ENSA-Khouribga',
    'street': 'Rue des Sciences Appliquées',
    'city': 'Khouribga',
    'country_id': env.ref('base.ma').id,  # Maroc
    'currency_id': env.ref('base.MAD').id,  # Dirham marocain
    'email': 'contact@mycompany.ma',
    'phone': '+212600000000'
})
print("✅ Société créée :", company.name)

# 2. Créer des utilisateurs
user1 = env['res.users'].create({
    'name': 'Saad Afifi',
    'login': 'saad',
    'password': 'ensakh2025',
    'company_id': company.id
})
user2 = env['res.users'].create({
    'name': 'Marwa Bouzare',
    'login': 'marwa',
    'password': 'ensakh2025',
    'company_id': company.id
})
print("✅ Utilisateurs créés :", user1.name, "et", user2.name)

# 3. Créer des clients et fournisseurs
for name, is_customer, is_supplier in [
    ('Client Alpha', True, False),
    ('Client Beta', True, False),
    ('Fournisseur X', False, True),
    ('Fournisseur Y', False, True)
]:
    partner = env['res.partner'].create({
        'name': name,
        'customer_rank': 1 if is_customer else 0,
        'supplier_rank': 1 if is_supplier else 0,
        'email': f'{name.lower().replace(" ", "_")}@mail.com'
    })
    print("✅ Créé :", name)

# 4. Créer des produits et services
product_model = env['product.product']
products = [
    {'name': 'Ordinateur Portable', 'type': 'product', 'list_price': 8000},
    {'name': 'Clavier Mécanique', 'type': 'product', 'list_price': 400},
    {'name': 'Maintenance Système', 'type': 'service', 'list_price': 500},
    {'name': 'Formation Logicielle', 'type': 'service', 'list_price': 1000},
]
for p in products:
    prod = product_model.create(p)
    print("✅ Produit créé :", prod.name)
