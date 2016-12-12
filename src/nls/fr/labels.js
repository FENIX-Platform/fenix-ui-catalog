if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    return {
        submit_button: "Envoyer",
        reset_button: "Réinitialiser",
        //menu and selector titles
        freeText: "Texte libre",
        resourceType: " Type de Ressource ",
        referencePeriod: "Période de Référence ",
        referenceArea: "Zone de Référence ",
        dataDomain: "Domaine des Données",
        statusOfConfidentiality: "Statut Confidentiel",
        uid: "Uid",
        title : "Titre",
        region : "Région",
        source : "Source",
        last_update : "Dernière mise à jour",
        periodicity : "Périodicité",
        contextSystem : "Source de Données",
        content : "Contenu",
        search_by_id : "Rechercher par ID",
        accessibility : "Accessibilité",
        action_select : "Sélectionner",
        action_download : "Télécharger",
        action_view : "Visualiser",
        action_metadata : "Métadonnées",
        //Errors
        request : "Erreur de demande",
        empty_values : "Sélection vide",
        header_title : "Ouvrir une ressource",
        tooltip_btn_close_catalog : "Fermer le catalogue",
        tooltip_btn_add_selector : "Ajouter métadonnées dans le champ de recherche ",

        filter_validation: "Critères de recherche non valides"
    }
});