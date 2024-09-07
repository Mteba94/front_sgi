import { TableColumns } from "@shared/models/list-table.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { ConstanciaResponse } from "../../models/constancia-response.interface";
import { MenuItems } from "@shared/models/menu-items.interface";

const searchOptions: SearchOptions[] = [{
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
    value: 4,
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

const tableColumns: TableColumns<ConstanciaResponse>[]= [
    {
        label: "Nombre",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "ct_PeNombre",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: true,
        sort: true,
        sortProperty: "ct_PeNombre",
        visible: true,
        download: true
    },
    {
        label: "Numero Correlativo",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "ct_FormatoCorrelativo",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "ct_FormatoCorrelativo",
        visible: true,
        download: true
    },
    {
        label: "Tipo Sacramento",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "ct_Sacramento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "ct_Sacramento",
        visible: true,
        download: true
    },
    {
        label: "Fecha de Constancia",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "ct_FechaImpresion",
        cssProperty: ["font-semibold", "text-sm"],
        type: "datetime",
        sticky: false,
        sort: true,
        sortProperty: "ct_FechaImpresion",
        visible: true,
        download: true
    },
    {
        label: "Generado Por",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "ct_Usuario",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "ct_Usuario",
        visible: true,
        download: true
    },
]

const filters = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startdate: null,
    enddate: null,
    refresh: false
}

const inputs = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startdate: null,
    enddate: null,
    refresh: false
}

export const componentSettings = {
    icCloudDownload: IconsService.prototype.getIcon("icCloudDownload"),
    searchOptions,
    menuItems,
    tableColumns,
    initialSort: "ct_ConstanciaId",
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