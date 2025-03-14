# Group "Decepticons"

## Members
- s337492 AKARCAY KAAN RIZA
- s338210 UNAL BARIS TAN 


# Exercise "Rescuing Surplus Food"

# Lab Journal

(you may update this file to keep track of the progress of your group work, throughout the weeks)

foods:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- name (TEXT, NOT NULL)
- quantity (INTEGER, NOT NULL)

surpriseBags:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- foods (TEXT, NOT NULL)

regularBags:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- foods (TEXT, NOT NULL)

bags:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- bags (TEXT, NOT NULL)

stores:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- name (TEXT, NOT NULL)
- address (TEXT, NOT NULL)
- phoneNumber (TEXT, NOT NULL)
- type (TEXT, NOT NULL)

users:
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- name (TEXT, NOT NULL)
- address (TEXT, NOT NULL)
- phoneNumber (TEXT, NOT NULL)
- username (TEXT, NOT NULL)
- password (TEXT, NOT NULL)