import { Reaction } from '/server/api';

Reaction.registerPackage({
    label: 'Classic WishList functionality for reaction',
    name: 'reaction-wish-list',
    icon: 'fa fa-thumb-tack',
    autoEnable: true,
    settings: {
     },
    registry: [
        {
            provides: 'dashboard',
            label: 'Wishlist',
            description: 'Classic wish list functionality',
            route: '/dashboard/wishlist',
            icon: 'fa fa-thumb-tack',
            container: 'core',
            template: 'wishlist',
            name: 'dashboardProductImporter',
            workflow: 'coreWorkflow',
            priority: 2
        }
    ]
})