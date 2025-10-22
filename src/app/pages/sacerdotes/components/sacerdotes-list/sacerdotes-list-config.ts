import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { SacerdoteResponse } from "../../models/sacerdote-response.interface";

const searchOptions: SearchOptions[] = [
    {
        label: "Nombre",
        value: 1,
        placeholder: "Buscar por Nombre",
        validation: [GenericValidators.defaultName],
        validation_desc: "Solo se permite letras en esta busqueda",
        icon: "icName"
    },
    // {
    //     label: "Numero Documento",
    //     value: 2,
    //     placeholder: "Buscar por Documento",
    //     validation: [GenericValidators.dni],
    //     validation_desc: "Solo se permite documentos válidos",
    //     icon: "icDescription"
    // },
    // {
    //     label: "Numero Partida",
    //     value: 3,
    //     placeholder: "Buscar por Numero Partida",
    //     validation: [GenericValidators.defaultDescription],
    //     validation_desc: "Solo se permite partidas válidas",
    //     icon: "icDescription"
    // }
]

const menuItems: MenuItems[] = [
    // {
    //     type: "link",
    //     id: "all",
    //     icon: IconsService.prototype.getIcon("icViewHeadline"),
    //     label: "Todos"
    // },
    // {
    //     type: "link",
    //     id: "Activo",
    //     value: 1,
    //     icon: IconsService.prototype.getIcon("icLabel"),
    //     label: "Activo",
    //     class: {
    //         icon: "text-green"
    //     }
    // },
    // {
    //     type: "link",
    //     id: "Inactivo",
    //     value: 0,
    //     icon: IconsService.prototype.getIcon("icLabel"),
    //     label: "Inactivo",
    //     class: {
    //         icon: "text-gray"
    //     }
    // }
]

const tableColumns: TableColumns<SacerdoteResponse>[] = [
    {
        label: "Nombre",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "sacerdoteNombre",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: true,
        sort: true,
        sortProperty: "sacerdoteNombre",
        visible: true,
        download: true
    },
    {
        label: "Grado Sacerdotal",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "sacerdoteCategoria",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "sacerdoteCategoria",
        visible: true,
        download: true
    },
    {
        label: "Firma",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "sacerdoteFirma",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "sacerdoteFirma",
        visible: true,
        download: true
    },
    // {
    //     label: "F. de Creacion",
    //     cssLabel: ["font-bold", "text-sm", "text-left"],
    //     property: "tsCreateDate",
    //     cssProperty: ["font-semibold", "text-sm"],
    //     type: "datetime",
    //     sticky: false,
    //     sort: true,
    //     sortProperty: "tsCreateDate",
    //     visible: true,
    //     download: true
    // },
    {
        label: "Estado",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "sacerdoteEstadoDesc",
        cssProperty: ["font-semibold", "text-sm"],
        type: "badge",
        sticky: false,
        sort: false,
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
        property: "icDelete",
        cssProperty: [],
        type: "icon",
        action: "delete",
        sticky: false,
        sort: false,
        visible: true,
        download: false
    },
    {
        label: "",
        cssLabel: [],
        property: "icFirma",
        cssProperty: [],
        type: "icon",
        action: "firma",
        sticky: false,
        sort: false,
        visible: true,
        download: false
    }
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
    icProvider: IconsService.prototype.getIcon("icPriest"),
    searchOptions,
    menuItems,
    tableColumns,
    initialSort: "sacerdoteId",
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