import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { UserResponse } from "../../models/user-response.interface";
import { TableColumns } from "@shared/models/list-table.interface";
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

const menuItems: MenuItems[] = [
    {
        type: "link",
        id: "all",
        icon: IconsService.prototype.getIcon("icViewHeadline"),
        label: "Todos"
    },
    {
        type: "link",
        id: "Activo",
        value: 1,
        icon: IconsService.prototype.getIcon("icLabel"),
        label: "Activo",
        class: {
            icon: "text-green"
        }
    },
    {
        type: "link",
        id: "Inactivo",
        value: 0,
        icon: IconsService.prototype.getIcon("icLabel"),
        label: "Inactivo",
        class: {
            icon: "text-gray"
        }
    }
]

const tableColumns: TableColumns<UserResponse>[] = [
    {
        label: "Nombre",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "usNombre",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: true,
        sort: true,
        sortProperty: "usNombre",
        visible: true,
        download: true
    },
    {
        label: "UserName",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "usUserName",
        cssProperty: ["font-semibold", "text-sm", "text-uppercase"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "usUserName",
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
        property: "usNumerodocumento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "usNumerodocumento",
        visible: true,
        download: true
    },
    {
        label: "Fecha Nacimiento",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "usFechaNacimiento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "datetime",
        sticky: false,
        sort: true,
        sortProperty: "usFechaNacimiento",
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
    icProvider: IconsService.prototype.getIcon("icProvider"),
    searchOptions,
    menuItems,
    tableColumns,
    initialSort: 'usIdUsuario',
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