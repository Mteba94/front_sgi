import { formatDate } from '@angular/common';
import { IconsService } from '@shared/services/icons.service';
import { COLORS_BADGE } from './variables';

export function convertDateToRequest(date, format: 'date' | 'datetime' | 'periodo') {
    switch (format) {
        case "date":
            return date == null ? null : formatDate(new Date(date), 'yyyy-MM-dd', 'en-ES');
        case "periodo":
            return date == null ? null : formatDate(new Date(date), 'yyyy-MM', 'en-US');
        case "datetime":
            return date == null ? null : formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss', 'en-US');

    }
}

export function toBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export function getIcon(iconName: string, tooltip: string, permission: boolean, action?: string){
    let generalCss = "flex justify-center items-center p-1.5 w-fit rounded-full ";

    let iconObject = {
        tooltip: null,
        icon: null,
        css: null,
        action: null
    }

    if(permission){
        iconObject = {
            tooltip,
            icon: IconsService.prototype.getIcon(iconName),
            css: generalCss + COLORS_BADGE.main,
            action: action ? action : null
        }

        if(["icEdit"].includes(iconName)){
            iconObject.css = generalCss + COLORS_BADGE.main;
        }

        if(["icDelete"].includes(iconName)){
            iconObject.css = generalCss + COLORS_BADGE.red;
        }

        if(["icCloudDownload"].includes(iconName)){
            iconObject.css = generalCss + COLORS_BADGE.coral;
        }

        if(["icGuardian"].includes(iconName)){
            iconObject.css = generalCss + COLORS_BADGE.red;
        }

        if(["icLockReset"].includes(iconName)){
            iconObject.css = generalCss + COLORS_BADGE.teal;
        }
    }

    return iconObject;
}