import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { tipoSacramento } from "src/app/responses/tipoSacramento/tiposacramento.response";
import icCategory from "@iconify/icons-ic/twotone-category"
import { ListTableMenu } from "src/app/commons/list-table-menu.interface";
import icViewHeadline from "@iconify/icons-ic/twotone-view-headline"
import icLabel from "@iconify/icons-ic/twotone-label"
import icCalendarMonth from "@iconify/icons-ic/twotone-calendar-today"
import { GenericValidators } from "@shared/validators/generic-validators";

const searchOptions = [
    {
        label: "Nombre",
        value: 1,
        placeholder: "Buscar por Nombre",
        validation: [GenericValidators.defaultName],
        validation_desc: "Solo se permite letras en esta busqueda",
        min_length: 2
    },
    {
        label: "Descipcion",
        value: 2,
        placeholder: "Buscar por Descripcion",
        validation: [GenericValidators.defaultDescription],
        validation_desc: "Solo se permite letras y numeros en esta busqueda",
        min_length: 2
    }
]

const menuItems: ListTableMenu[] = [
    {
        type: "link",
        id: "all",
        icon: icViewHeadline,
        label: "Todos"
    },
    {
        type: "link",
        id: "Activo",
        value: 1,
        icon: icLabel,
        label: "Activo",
        classes: {
            icon: "text-green"
        }
    },
    {
        type: "link",
        id: "Inactivo",
        value: 0,
        icon: icLabel,
        label: "Inactivo",
        classes: {
            icon: "text-gray"
        }
    }
]

const tableColumns: TableColumn<tipoSacramento>[] = [
    {
        label: "Nombre",
        property: "tsNombre",
        type: "text",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "Descripcion",
        property: "tsDescripcion",
        type: "textTruncate",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "Requerimiento",
        property: "tsRequerimiento",
        type: "textTruncate",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "F. Creacion",
        property: "tsCreateDate",
        type: "datetime",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "Estado",
        property: "estadoDescripcion",
        type: "badge",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "",
        property: 'menu',
        type: 'buttonGroup',
        buttonItems: [
            {
                buttonLabel: "EDITAR",
                buttonAction: "edit",
                buttonCondition: null,
                disable: false
            },
            {
                buttonLabel: "ELIMINAR",
                buttonAction: "remove",
                buttonCondition: null,
                disable: false
            }
        ],
        cssClasses: ["font-medium","w-10"]
    }
]

const filters = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startdate: null,
    enddate: null
}

const inputs = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startdate: null,
    enddate: null
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
    //search filters
    menuItems: menuItems,
    searchOptions: searchOptions,
    filters_dates_active: false,
    filters: filters,
    datesFilterArray: ['Fecha de creación'],
    columnsFilter: tableColumns.map((column) => {return {label: column.label, property: column.property, type: column.type}} )
}