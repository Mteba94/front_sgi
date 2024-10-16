import { Icon } from '@visurel/iconify-angular';

export interface MenuItems {
    type: 'link';
    id?: 'all' | 'Activo' | 'Inactivo' | string ;
    icon?: Icon;
    label: string;
    value?: number;
    class?: {
        icon?: string;
    };
    size?: string;
}