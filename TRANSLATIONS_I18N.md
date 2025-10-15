# 🌐 Traductions i18n - Nouvelles Fonctionnalités

## Traductions à ajouter dans `client/src/i18n.js`

### Français (fr)

```javascript
// Admin - Demandes de retrait
admin: {
  withdrawalRequests: {
    title: 'Demandes de Retrait de Projet',
    subtitle: 'Gérez les demandes de retrait des agriculteurs',
    filterPending: 'En attente',
    filterApproved: 'Approuvées',
    filterRejected: 'Rejetées',
    filterAll: 'Toutes',
    approve: 'Approuver',
    reject: 'Rejeter',
    approveTitle: 'Approuver la demande',
    rejectTitle: 'Rejeter la demande',
    notes: 'Notes',
    notesOptional: 'Notes optionnelles...',
    notesRequired: 'Raison du rejet (minimum 10 caractères)...',
    confirmApproval: 'Confirmer l\'approbation',
    confirmRejection: 'Confirmer le rejet',
    cancel: 'Annuler',
    noRequests: 'Aucune demande',
    noPendingRequests: 'Aucune demande en attente pour le moment',
    approvedSuccess: 'Demande approuvée avec succès',
    rejectedSuccess: 'Demande rejetée',
    error: 'Erreur lors du traitement'
  },
  
  withdrawalSettings: {
    title: 'Paramètres de Retrait',
    subtitle: 'Configurez les frais et limites de retrait',
    feePercentage: 'Pourcentage de Frais de Retrait (%)',
    feePercentageHelp: 'Frais appliqués sur chaque retrait (0-100%)',
    minAmount: 'Montant Minimum de Retrait (GYT)',
    minAmountHelp: 'Montant minimum requis pour effectuer un retrait',
    save: 'Enregistrer les Paramètres',
    saving: 'Enregistrement...',
    exampleTitle: 'Exemple de Calcul',
    withdrawalAmount: 'Montant du retrait',
    fees: 'Frais',
    netAmount: 'Montant net reçu',
    infoTitle: 'Informations Importantes',
    info1: 'Les frais sont appliqués automatiquement lors de chaque retrait',
    info2: 'Les utilisateurs verront le montant net avant de confirmer le retrait',
    info3: 'Le montant minimum empêche les retraits trop petits',
    info4: 'Les modifications prennent effet immédiatement',
    currentSettings: 'Paramètres Actuels',
    withdrawalFee: 'Frais de retrait',
    minWithdrawal: 'Montant minimum',
    updateSuccess: 'Paramètres mis à jour avec succès',
    updateError: 'Erreur lors de la mise à jour'
  }
},

// Farmer - Gestion de projet
farmer: {
  projectManagement: {
    title: 'Gestion du Projet',
    backToProjects: 'Retour à mes projets',
    tabOverview: 'Vue d\'ensemble',
    tabUpdates: 'Mises à jour',
    tabWithdrawal: 'Retrait de fonds',
    
    // Overview
    budget: 'Budget',
    funded: 'Financé',
    investors: 'Investisseurs',
    duration: 'Durée',
    estimatedReturn: 'Rendement estimé',
    category: 'Catégorie',
    status: 'Statut',
    
    // Updates
    newUpdate: 'Nouvelle mise à jour',
    noUpdates: 'Aucune mise à jour',
    noUpdatesDesc: 'Tenez vos investisseurs informés de l\'avancement du projet',
    createFirstUpdate: 'Créer la première mise à jour',
    updateTitle: 'Titre',
    updateTitlePlaceholder: 'Ex: Semaine 1 - Plantation terminée',
    updateContent: 'Contenu',
    updateContentPlaceholder: 'Décrivez l\'avancement du projet...',
    updateVisibility: 'Visible par les investisseurs',
    updatePrivate: 'Privé',
    createUpdate: 'Nouvelle mise à jour',
    editUpdate: 'Modifier la mise à jour',
    publish: 'Publier la mise à jour',
    saveChanges: 'Enregistrer les modifications',
    publishing: 'Publication...',
    saving: 'Enregistrement...',
    edit: 'Modifier',
    delete: 'Supprimer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette mise à jour ?',
    publishSuccess: 'Mise à jour publiée avec succès',
    updateSuccess: 'Mise à jour modifiée avec succès',
    deleteSuccess: 'Mise à jour supprimée',
    error: 'Erreur lors de l\'opération',
    
    // Withdrawal
    fundingProgress: 'Progression du financement',
    availableAmount: 'Montant disponible',
    requestWithdrawal: 'Demander le retrait des fonds',
    requesting: 'Envoi en cours...',
    requestSuccess: 'Demande de retrait envoyée avec succès',
    requestError: 'Erreur lors de la demande',
    requestConfirm: 'Êtes-vous sûr de vouloir demander le retrait des fonds de ce projet ?',
    notFullyFunded: 'Le projet doit être financé à 100% pour demander un retrait',
    alreadyWithdrawn: 'Les fonds ont déjà été retirés',
    pendingRequest: 'Une demande de retrait est déjà en cours',
    requestHistory: 'Historique des demandes',
    adminNotes: 'Notes de l\'administrateur',
    approvedBy: 'Approuvée par',
    rejectedBy: 'Rejetée par',
    on: 'le'
  }
},

// Consumer - Suivi de commande
orders: {
  tracking: {
    title: 'Suivi de commande',
    orderNumber: 'Commande',
    back: 'Retour',
    notFound: 'Commande non trouvée',
    backToDashboard: 'Retour au tableau de bord',
    
    // Status
    statusPending: 'En attente',
    statusPendingDesc: 'Votre commande est en cours de traitement',
    statusPaid: 'Payée',
    statusPaidDesc: 'Paiement reçu, préparation en cours',
    statusProcessing: 'En préparation',
    statusProcessingDesc: 'Votre commande est en cours de préparation',
    statusShipped: 'Expédiée',
    statusShippedDesc: 'Votre commande est en route',
    statusDelivered: 'Livrée',
    statusDeliveredDesc: 'Commande livrée avec succès',
    statusCancelled: 'Annulée',
    statusCancelledDesc: 'Commande annulée',
    
    // Actions
    confirmDelivery: 'Confirmer la livraison',
    confirmDeliveryTitle: 'Confirmer la livraison',
    confirmDeliveryQuestion: 'Confirmez-vous avoir reçu votre commande en bon état ?',
    deliveryNotes: 'Notes (optionnel)',
    deliveryNotesPlaceholder: 'Commentaires sur la livraison...',
    confirmReception: 'Confirmer la réception',
    confirming: 'Confirmation...',
    cancel: 'Annuler',
    track: 'Suivre',
    
    // Sections
    orderedItems: 'Articles commandés',
    orderHistory: 'Historique de la commande',
    shippingAddress: 'Adresse de livraison',
    total: 'Total',
    quantity: 'Quantité',
    farmer: 'Agriculteur',
    
    // Messages
    confirmSuccess: 'Livraison confirmée avec succès',
    confirmError: 'Erreur lors de la confirmation',
    receivedQuestion: 'Avez-vous reçu votre commande ?',
    receivedDesc: 'Confirmez la réception pour clôturer la commande'
  }
},

// Investor - Retours sur investissement
investor: {
  returns: {
    title: 'Mes Investissements',
    subtitle: 'Suivi de vos retours sur investissement',
    totalInvested: 'Total Investi',
    returnsReceived: 'Retours Reçus',
    pending: 'En Attente',
    distributed: 'Distribués',
    invest: 'Investir',
    noInvestments: 'Aucun investissement',
    noInvestmentsDesc: 'Commencez à investir dans des projets agricoles',
    discoverProjects: 'Découvrir les projets',
    
    // Investment details
    amountInvested: 'Montant Investi',
    estimatedReturn: 'Rendement Estimé',
    expectedReturn: 'Retour Attendu',
    returnReceived: 'Retour Reçu',
    returnType: 'Type de Retour',
    returnTypeFinancial: 'Financier',
    returnTypeProducts: 'Produits',
    investedOn: 'Investi le',
    returnReceivedOn: 'Retour reçu le',
    
    // Status
    statusPending: 'En attente',
    statusDistributed: 'Distribué',
    statusCompleted: 'Complété',
    
    // Messages
    returnDistributed: 'Retour distribué !',
    returnDistributedDesc: 'Vous avez reçu',
    awaitingDistribution: 'En attente de distribution',
    awaitingDistributionDesc: 'Le projet est complété. L\'administrateur va bientôt distribuer les retours.'
  }
}
```

### Anglais (en)

```javascript
// Admin - Withdrawal requests
admin: {
  withdrawalRequests: {
    title: 'Project Withdrawal Requests',
    subtitle: 'Manage farmer withdrawal requests',
    filterPending: 'Pending',
    filterApproved: 'Approved',
    filterRejected: 'Rejected',
    filterAll: 'All',
    approve: 'Approve',
    reject: 'Reject',
    approveTitle: 'Approve request',
    rejectTitle: 'Reject request',
    notes: 'Notes',
    notesOptional: 'Optional notes...',
    notesRequired: 'Rejection reason (minimum 10 characters)...',
    confirmApproval: 'Confirm approval',
    confirmRejection: 'Confirm rejection',
    cancel: 'Cancel',
    noRequests: 'No requests',
    noPendingRequests: 'No pending requests at the moment',
    approvedSuccess: 'Request approved successfully',
    rejectedSuccess: 'Request rejected',
    error: 'Error during processing'
  },
  
  withdrawalSettings: {
    title: 'Withdrawal Settings',
    subtitle: 'Configure fees and withdrawal limits',
    feePercentage: 'Withdrawal Fee Percentage (%)',
    feePercentageHelp: 'Fee applied on each withdrawal (0-100%)',
    minAmount: 'Minimum Withdrawal Amount (GYT)',
    minAmountHelp: 'Minimum amount required to make a withdrawal',
    save: 'Save Settings',
    saving: 'Saving...',
    exampleTitle: 'Calculation Example',
    withdrawalAmount: 'Withdrawal amount',
    fees: 'Fees',
    netAmount: 'Net amount received',
    infoTitle: 'Important Information',
    info1: 'Fees are automatically applied on each withdrawal',
    info2: 'Users will see the net amount before confirming withdrawal',
    info3: 'Minimum amount prevents too small withdrawals',
    info4: 'Changes take effect immediately',
    currentSettings: 'Current Settings',
    withdrawalFee: 'Withdrawal fee',
    minWithdrawal: 'Minimum amount',
    updateSuccess: 'Settings updated successfully',
    updateError: 'Error updating settings'
  }
},

// Farmer - Project management
farmer: {
  projectManagement: {
    title: 'Project Management',
    backToProjects: 'Back to my projects',
    tabOverview: 'Overview',
    tabUpdates: 'Updates',
    tabWithdrawal: 'Fund Withdrawal',
    
    // Overview
    budget: 'Budget',
    funded: 'Funded',
    investors: 'Investors',
    duration: 'Duration',
    estimatedReturn: 'Estimated Return',
    category: 'Category',
    status: 'Status',
    
    // Updates
    newUpdate: 'New update',
    noUpdates: 'No updates',
    noUpdatesDesc: 'Keep your investors informed about project progress',
    createFirstUpdate: 'Create first update',
    updateTitle: 'Title',
    updateTitlePlaceholder: 'E.g.: Week 1 - Planting completed',
    updateContent: 'Content',
    updateContentPlaceholder: 'Describe project progress...',
    updateVisibility: 'Visible to investors',
    updatePrivate: 'Private',
    createUpdate: 'New update',
    editUpdate: 'Edit update',
    publish: 'Publish update',
    saveChanges: 'Save changes',
    publishing: 'Publishing...',
    saving: 'Saving...',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this update?',
    publishSuccess: 'Update published successfully',
    updateSuccess: 'Update modified successfully',
    deleteSuccess: 'Update deleted',
    error: 'Error during operation',
    
    // Withdrawal
    fundingProgress: 'Funding progress',
    availableAmount: 'Available amount',
    requestWithdrawal: 'Request fund withdrawal',
    requesting: 'Sending...',
    requestSuccess: 'Withdrawal request sent successfully',
    requestError: 'Error sending request',
    requestConfirm: 'Are you sure you want to request withdrawal of project funds?',
    notFullyFunded: 'Project must be 100% funded to request withdrawal',
    alreadyWithdrawn: 'Funds have already been withdrawn',
    pendingRequest: 'A withdrawal request is already pending',
    requestHistory: 'Request history',
    adminNotes: 'Administrator notes',
    approvedBy: 'Approved by',
    rejectedBy: 'Rejected by',
    on: 'on'
  }
},

// Consumer - Order tracking
orders: {
  tracking: {
    title: 'Order Tracking',
    orderNumber: 'Order',
    back: 'Back',
    notFound: 'Order not found',
    backToDashboard: 'Back to dashboard',
    
    // Status
    statusPending: 'Pending',
    statusPendingDesc: 'Your order is being processed',
    statusPaid: 'Paid',
    statusPaidDesc: 'Payment received, preparing order',
    statusProcessing: 'Processing',
    statusProcessingDesc: 'Your order is being prepared',
    statusShipped: 'Shipped',
    statusShippedDesc: 'Your order is on its way',
    statusDelivered: 'Delivered',
    statusDeliveredDesc: 'Order delivered successfully',
    statusCancelled: 'Cancelled',
    statusCancelledDesc: 'Order cancelled',
    
    // Actions
    confirmDelivery: 'Confirm delivery',
    confirmDeliveryTitle: 'Confirm delivery',
    confirmDeliveryQuestion: 'Do you confirm that you received your order in good condition?',
    deliveryNotes: 'Notes (optional)',
    deliveryNotesPlaceholder: 'Comments about delivery...',
    confirmReception: 'Confirm reception',
    confirming: 'Confirming...',
    cancel: 'Cancel',
    track: 'Track',
    
    // Sections
    orderedItems: 'Ordered items',
    orderHistory: 'Order history',
    shippingAddress: 'Shipping address',
    total: 'Total',
    quantity: 'Quantity',
    farmer: 'Farmer',
    
    // Messages
    confirmSuccess: 'Delivery confirmed successfully',
    confirmError: 'Error confirming delivery',
    receivedQuestion: 'Did you receive your order?',
    receivedDesc: 'Confirm reception to close the order'
  }
},

// Investor - Investment returns
investor: {
  returns: {
    title: 'My Investments',
    subtitle: 'Track your investment returns',
    totalInvested: 'Total Invested',
    returnsReceived: 'Returns Received',
    pending: 'Pending',
    distributed: 'Distributed',
    invest: 'Invest',
    noInvestments: 'No investments',
    noInvestmentsDesc: 'Start investing in agricultural projects',
    discoverProjects: 'Discover projects',
    
    // Investment details
    amountInvested: 'Amount Invested',
    estimatedReturn: 'Estimated Return',
    expectedReturn: 'Expected Return',
    returnReceived: 'Return Received',
    returnType: 'Return Type',
    returnTypeFinancial: 'Financial',
    returnTypeProducts: 'Products',
    investedOn: 'Invested on',
    returnReceivedOn: 'Return received on',
    
    // Status
    statusPending: 'Pending',
    statusDistributed: 'Distributed',
    statusCompleted: 'Completed',
    
    // Messages
    returnDistributed: 'Return distributed!',
    returnDistributedDesc: 'You received',
    awaitingDistribution: 'Awaiting distribution',
    awaitingDistributionDesc: 'Project is completed. Administrator will distribute returns soon.'
  }
}
```

---

## Instructions d'Intégration

### 1. Ouvrir le fichier i18n.js
```bash
client/src/i18n.js
```

### 2. Ajouter les traductions
Ajouter les sections ci-dessus dans les objets `resources.fr.translation` et `resources.en.translation`

### 3. Vérifier la structure
```javascript
const resources = {
  fr: {
    translation: {
      // ... traductions existantes
      admin: {
        // ... admin existant
        withdrawalRequests: { ... },
        withdrawalSettings: { ... }
      },
      farmer: {
        // ... farmer existant
        projectManagement: { ... }
      },
      orders: {
        // ... orders existant
        tracking: { ... }
      },
      investor: {
        // ... investor existant
        returns: { ... }
      }
    }
  },
  en: {
    translation: {
      // ... même structure en anglais
    }
  }
};
```

### 4. Utilisation dans les composants
```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <h1>{t('admin.withdrawalRequests.title')}</h1>
  );
};
```

---

## Statut
- ✅ Traductions françaises : Complètes
- ✅ Traductions anglaises : Complètes
- ⏳ Traductions espagnoles : À faire (optionnel)
- ⏳ Intégration dans i18n.js : À faire

**Note** : Les composants utilisent actuellement du texte en dur. Il faudra remplacer par `t('key')` pour activer les traductions.
