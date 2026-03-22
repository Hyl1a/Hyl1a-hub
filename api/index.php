<?php
// Ce fichier sert uniquement de proxy pour Vercel.
// Vercel exige que les scripts serveur soient dans le dossier /api/
chdir(__DIR__ . '/../');
require 'index.php';
