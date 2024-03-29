Ext.define('backapp.view.FicheCommande', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.dataview.List',

    ],
    config: {
        cls: 'product-list-page',
        layout: 'vbox',
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                action: 'commandetitle',
                title: 'COMMANDE',
                cls: 'header top',
                items: [
                    {
                        xtype: 'button',
                        text: '',
                        iconCls: 'fa fa-navicon',
                        cls: 'open-socials',
                        handler: function(){
                            backapp.utils.Config.toggleMenu();
                        }
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype : 'button',
                        hidden: false,
                        ui    : 'decline',
                        action: 'back',
                        iconCls: 'fa fa-arrow-left',
                        cls: 'open-socials',
                        text  : ''
                    }
                ]
            },
            {
                layout: 'hbox',
                flex: 'auto',
                width: '100%',
                cls: 'product-barre',
                items: [
                    {
                        action: 'detailcommande',
                        flex: 1,
                        style: 'margin: 10px;min-height:150px',
                        html: ''
                    },
                    {
                        layout: 'vbox',
                        flex: 1,
                        height: '100%',
                        items: [
                            {
                                xtype: 'button',
                                cls: 'driveo-button success block',
                                action: 'commandePrepare',
                                text: 'Commande préparée'
                            },
                            {
                                xtype: 'button',
                                cls: 'driveo-button warning block',
                                action: 'commandeRetire',
                                text: 'Commande retirée'
                            },
                            {
                                xtype: 'button',
                                cls: 'driveo-button danger block',
                                action: 'commandeCloture',
                                text: 'Commande cloturée'
                            },
                            {
                                xtype: 'hiddenfield',
                                action: 'commandeId',
                                value: ''
                            }
                        ]
                    }
                ]
            },
            {
                flex:1,
                title: 'Détail commande',
                iconCls: 'home',
                width: '100%',
                height: '100%',
                xtype: 'list',
                store: 'DetailCommande',
                cls: 'product-list',
                infinite: false,
                itemTpl: '<div class="product">'+
                '<img src="'+backapp.utils.Config.getDomain()+'/{Image}.mini.60x60.jpg" class="float-left product-avatar" alt="img">'+
                '<span class="product-dist product-near">{TarifText}</span>'+
                '<h2>{Titre}</h2>'+
                '<span class="valet-address">Quantité: {Quantite}</span>'+
                    /*'<span class="valet-address">Poids: {Poids}<br />Largeur: {Largeur} <br />Hauteur: {Hauteur} <br /> Profondeur: {Profondeur}</span>'+*/
                '</div>',
                grouped: false,
                pinHeaders: false
            }
        ]
    },
    setRecord: function (record){
        this.down('[action=commandetitle]').setTitle(record.get('RefCommande'));
        this.down('[action=detailcommande]').setHtml('<div class="product">'+
            '<span class="product-dist product-near warning">Montant total: '+record.get('MontantTTC')+' € TTC</span>'+
            '<div class="list-item-right">'+record.get('Etat')+'</div>'+
            '<h1>'+record.get('Nom')+' '+record.get('Prenom')+'</h1><p>'+
            'Tel: '+record.get('Telephone')+'<br/>'+
            'Email: '+record.get('Mail')+'<br/>'+
            'Adresse: '+record.get('Adresse')+'<br/>'+
            ''+record.get('CodePostal')+' '+record.get('Ville')+'<br/>'+
            '<b>Date: '+record.get('DateCommande')+'</b></p></div>');
        this.down('[action=commandeId]').setValue(record.get('id'));

        //redefinition du store PANIER
        var dc = Ext.getStore('DetailCommande');
        dc.getProxy().setApi({
            read: backapp.utils.Config.getDomain()+'/Boutique/Commande/'+record.get('id')+'/LigneCommande/getData.json'
        });
        dc.getProxy().setExtraParams({
            user_id: backapp.utils.Config.getCurrentUser().user_id,
            logkey: backapp.utils.Config.getCurrentKey()
        });

        //modification de l'état des boutons
        this.down('[action=commandePrepare]').setHidden(false);
        this.down('[action=commandeRetire]').setHidden(false);
        this.down('[action=commandeCloture]').setHidden(false);

        if (record.get('Prepare'))
            this.down('[action=commandePrepare]').setHidden(true);
        if (record.get('Expedie'))
            this.down('[action=commandeRetire]').setHidden(true);
        if (record.get('Cloture'))
            this.down('[action=commandeCloture]').setHidden(true);

        //chargement des store
        dc.load();

    }
});
