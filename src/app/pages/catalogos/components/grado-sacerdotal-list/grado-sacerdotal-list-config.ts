import { TableColumns } from "@shared/models/list-table.interface"
import { gradoSacerdotalResponse } from "../../models/gradoSacerdotal-response.interface"
import { IconsService } from "@shared/services/icons.service"
import { MenuItems } from "@shared/models/menu-items.interface"
import icCategory from "@iconify/icons-ic/twotone-category"
import icCalendarMonth from "@iconify/icons-ic/twotone-calendar-today"
import { SearchOptions } from "@shared/models/search-options.interface"
import { GenericValidators } from "@shared/validators/generic-validators"

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

const tableColumns: TableColumns<gradoSacerdotalResponse>[] = [
    {
        label: "Grado",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "csNombre",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: true,
        sort: true,
        sortProperty: "csNombre",
        visible: true,
        download: true
    },
    {
        label: "Abreviatura",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "csAbreviacion",
        cssProperty: ["font-semibold", "text-sm"],
        type: "text",
        sticky: false,
        sort: true,
        sortProperty: "csAbreviacion",
        visible: true,
        download: true
    },
    {
        label: "Estado",
        cssLabel: ["font-bold", "text-sm", "text-left"],
        property: "csEstadoDesc",
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
    initialSort: "csId",
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