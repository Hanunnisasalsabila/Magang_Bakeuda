DELETE FROM "riwayat_pelacakan" WHERE "id_user" = (SELECT "id_user" FROM "users" WHERE "username" = 'admin');
DELETE FROM "users" WHERE "username" = 'admin';
