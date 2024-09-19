import { TableColumns } from "@shared/models/list-table.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { GenericValidators } from "@shared/validators/generic-validators";
import { SacramentoResponse } from "../../models/sacramento-response.interface";
import { IconsService } from "@shared/services/icons.service";
import { MenuItems } from "@shared/models/menu-items.interface";

const searchOptions: SearchOptions[] = [
    {
        label: "Nombre",
        value: 1,
        placeholder: "Buscar por Nombre",
        validation: [GenericValidators.defaultName],
        validation_desc: "Solo se permite letras en esta busqueda",
        icon: "icName"
    },
    {
        label: "Numero Documento",
        value: 2,
        placeholder: "Buscar por Documento",
        validation: [GenericValidators.dni],
        validation_desc: "Solo se permite documentos válidos",
        icon: "icDescription"
    },
    {
        label: "Numero Partida",
        value: 3,
        placeholder: "Buscar por Numero Partida",
        validation: [GenericValidators.defaultDescription],
        validation_desc: "Solo se permite partidas válidas",
        icon: "icDescription"
    }
]

export let menuItems: MenuItems[] = [];

export function updateMenuItems(sacramentos: any) {
const baseMenuItems: MenuItems[] = [
    {
        type: "link",
        id: "all",
        icon: IconsService.prototype.getIcon("icViewHeadline"),
        label: "Todos"
    }
]

const sacramentoMenuItems: MenuItems[] = sacramentos.map((sacramento, index) => ({
    type: "link",
    id: sacramento.tsNombre,  // Ajusta según la estructura de sacramento
    value: sacramento.tsIdTipoSacramento,
    icon: IconsService.prototype.getIcon("icSacramento"),
    label: sacramento.tsNombre,  // Ajusta según la estructura de sacramento
    class: {
      icon: "text-gray"
    }
  }));

  menuItems = [...baseMenuItems, ...sacramentoMenuItems];
}

const tableColumns: TableColumns<SacramentoResponse>[] = [
    {
        label: "Nombre",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "peNombre",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: true,
        sort: true,
        sortProperty: "peNombre",
        visible: true,
        download: true
    },
    {
        label: "Numero Partida",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "scNumeroPartida",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "scNumeroPartida",
        visible: true,
        download: true
    },
    {
        label: "Tipo Sacramento",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "scTipoSacramento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "scTipoSacramento",
        visible: true,
        download: true
    },
    {
        label: "Numero Documento",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "peNumeroDocumento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "peNumeroDocumento",
        visible: true,
        download: true
    },
    {
        label: "Fecha Sacramento",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "scFechaSacramento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "datetime",
        sticky: false,
        sort: true,
        sortProperty: "scFechaSacramento",
        visible: true,
        download: true
    },
    {
        label: "Observaciones",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "scObservaciones",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: false,
        sortProperty: "scObservaciones",
        visible: true,
        download: true
    },
    {
        label: "",
        cssLabel: [],
        property: "icEdit",
        cssProperty: [],
        type: "icon",
        action: "edit",
        sticky: false,
        sort: false,
        visible: true,
        download: false
    },
    {
        label: "",
        cssLabel: [],
        property: "icCloudDownload",
        cssProperty: [],
        type: "icon",
        action: "constancia",
        sticky: false,
        sort: false,
        visible: true,
        download: false
    },
]

const filters = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startDate: null,
    endDate: null,
    refresh: false
}

const inputs = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startDate: null,
    endDate: null,
    refresh: false
}

export const componentSettings = {
    icProvider: IconsService.prototype.getIcon("icProvider"),
    searchOptions,
    menuItems,
    tableColumns,
    initialSort: "scIdSacramento",
    initialSortDir: "desc",
    filters,
    getInputs: inputs,
    columnsFilter: tableColumns.map((column) => {
        return {
            label: column.label,
            property: column.property,
            type: column.type
        }
    })
}