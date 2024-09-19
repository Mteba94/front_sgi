import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { tipoSacramento } from "src/app/pages/tipo-sacramento/models/tiposacramento.response";
import icCategory from "@iconify/icons-ic/twotone-category"
import { ListTableMenu } from "src/app/commons/list-table-menu.interface";
import icCalendarMonth from "@iconify/icons-ic/twotone-calendar-today"
import { GenericValidators } from "@shared/validators/generic-validators";
import { TableColumns } from "@shared/models/list-table.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { IconsService } from "@shared/services/icons.service";

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
        label: "Descipcion",
        value: 2,
        placeholder: "Buscar por Descripcion",
        validation: [GenericValidators.defaultDescription],
        validation_desc: "Solo se permite letras y numeros en esta busqueda",
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

const tableColumns: TableColumns<tipoSacramento>[] = [
    {
        label: "Nombre",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "tsNombre",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: true,
        sort: true,
        sortProperty: "tsNombre",
        visible: true,
        download: true
    },
    {
        label: "Descripcion",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "tsDescripcion",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "tsDescripcion",
        visible: true,
        download: true
    },
    {
        label: "Requerimiento",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "tsRequerimiento",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "tsRequerimiento",
        visible: true,
        download: true
    },
    {
        label: "F. de Creacion",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "tsCreateDate",
        cssProperty: ["font-semibold", "text-sm"],
        type: "datetime",
        sticky: false,
        sort: true,
        sortProperty: "tsCreateDate",
        visible: true,
        download: true
    },
    {
        label: "Estado",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "estadoDescripcion",
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
        action: "remove",
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
    endDate: null
}

const inputs = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startDate: null,
    endDate: null
}

export const componentSettings = {
    // ICONS
    icCategory: icCategory,
    icCalendarMonth: icCalendarMonth,
    //Layout settings
    menuOpen: false,    
    //TABLE SETTINS
    tableColumns: tableColumns,
    initialSort: "TsIdTipoSacramento",
    initialSortDir: "desc",
    getInputs: inputs,
    buttonlabel: "EDITAR",
    buttonlabel2: "ELIMINAR",
    //search: filters,
    menuItems: menuItems,
    searchOptions: searchOptions,
    filters_dates_active: false,
    filters: filters,
    datesFilterArray: ['Fecha de creación'],
    columnsFilter: tableColumns.map((column) => {return {label: column.label, property: column.property, type: column.type}} )
}