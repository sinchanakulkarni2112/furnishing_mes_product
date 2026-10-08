/** @odoo-module **/

/**
 * The three OWL tours the mentor's click-through asks for: Shop Floor
 * Terminal, Scheduling Board, Executive Dashboard.
 *
 * Every selector below is taken from this module's own templates
 * (`static/src/xml/*.xml`) — a tour that names a class no template renders
 * fails at its first step, and `test_ui_and_tours.py::
 * test_every_tour_trigger_resolves_to_a_real_template_class` now asserts
 * exactly that, so the two can no longer drift apart.
 *
 * Navigation deliberately goes the way a user goes: the apps menu, then the
 * tile dashboard, then the leaf tile. Nothing here hard-codes a database id —
 * tiles are addressed by `data-menu-xmlid`, which `menu_dashboard.xml` puts
 * on every tile it renders.
 *
 * Only one step writes anything: entering the PIN switches which operator the
 * tablet is recording for (the Round 2 shared-tablet switch). It needs a
 * provisioned PIN — the seed gives Marc Demo `4417` — and the terminal's gate
 * stays up on a database where no operator has one, by design. Nothing is
 * produced, submitted or approved by these tours, so they can be replayed.
 *
 * Launch one from the browser console: `startTour("fmes_shopfloor_terminal_tour")`.
 */

import { registry } from "@web/core/registry";
import { stepUtils } from "@web_tour/tour_service/tour_utils";

/** Open the Furnishing MES app from the apps menu (community path). */
const openApp = () =>
    stepUtils.goToAppSteps(
        "furnishing_mes.menu_fmes_root",
        "Open the Furnishing MES app",
    );

/** Click a tile of the dashboard by the menu it stands for. */
const tile = (menuXmlid, description) => ({
    trigger: `.o_fmes_menu_dashboard_tile[data-menu-xmlid="${menuXmlid}"]`,
    content: description,
    run: "click",
});

/** Type one digit of the operator PIN on the terminal's keypad. */
const pinDigit = (digit) => ({
    trigger: `.fmes-t-pin-key:contains("${digit}")`,
    content: `Type PIN digit ${digit}`,
    run: "click",
});

registry.category("web_tour.tours").add("fmes_shopfloor_terminal_tour", {
    url: "/odoo?debug=assets",
    steps: () => [
        ...openApp(),
        tile(
            "furnishing_mes.menu_fmes_planning",
            "Open Production Planning from the tiles",
        ),
        tile(
            "furnishing_mes.menu_fmes_planning_shiftlogs",
            "Open the Shift Logs folder",
        ),
        tile("furnishing_mes.menu_fmes_terminal", "Open the Shop Floor Terminal"),
        {
            trigger: ".fmes-terminal",
            content: "The terminal renders",
        },
        {
            trigger: ".fmes-t-pin-modal",
            content: "The PIN gate asks which operator is recording",
        },
        {
            trigger: ".fmes-t-pin-grid",
            content: "The keypad is ready for the operator's PIN",
        },
        pinDigit(4),
        pinDigit(4),
        pinDigit(1),
        pinDigit(7),
        {
            trigger: ".fmes-t-pin-key-go",
            content: "Confirm the PIN and switch operator",
            run: "click",
        },
        {
            trigger: ".fmes-t-machine-grid",
            content: "The machine picker lists this operator's machines",
        },
        {
            trigger: ".fmes-t-machine",
            content: "Choose a machine to start recording against",
            run: "click",
        },
        {
            trigger: ".fmes-t-summary",
            content: "Target, produced, rejected and achievement for this shift",
        },
        {
            trigger: ".fmes-t-shifts",
            content: "The shift switcher sits in the header",
        },
        {
            trigger: ".fmes-t-pin-reverify",
            content: "Switch Operator (PIN) is always one tap away",
        },
    ],
});

registry.category("web_tour.tours").add("fmes_scheduling_board_tour", {
    url: "/odoo?debug=assets",
    steps: () => [
        ...openApp(),
        tile(
            "furnishing_mes.menu_fmes_planning",
            "Open Production Planning from the tiles",
        ),
        tile(
            "furnishing_mes.menu_fmes_planning_schedule",
            "Open the Production Schedule folder",
        ),
        tile("furnishing_mes.menu_fmes_scheduling_board", "Open the Scheduling Board"),
        {
            trigger: ".fmes-board",
            content: "The Scheduling Board renders",
        },
        {
            trigger: ".fmes-board-toolbar",
            content: "Preset and date filters sit above the grid",
        },
        {
            trigger: ".fmes-board-summary",
            content: "Machines, planned hours, capacity and utilisation",
        },
        {
            trigger: ".fmes-board-table",
            content: "One row per machine, one column per shift and day",
        },
        {
            trigger: ".fmes-legend",
            content: "The load legend explains the cell colours",
        },
        {
            trigger: ".fmes-board-controls select",
            content: "Switch the board to the weekly preset",
            run: "select week",
        },
        {
            trigger: ".fmes-board-toolbar",
            content: "The board repaints for the new preset",
        },
    ],
});

registry.category("web_tour.tours").add("fmes_executive_dashboard_tour", {
    url: "/odoo?debug=assets",
    steps: () => [
        ...openApp(),
        tile("furnishing_mes.menu_fmes_dashboard", "Open the Monitoring tab"),
        tile(
            "furnishing_mes.menu_fmes_executive_dashboard",
            "Open the Executive Dashboard",
        ),
        {
            trigger: ".fmes-dashboard",
            content: "The Executive Dashboard renders",
        },
        {
            trigger: ".fmes-dashboard-controls",
            content: "Period presets, date range, department filter and refresh",
        },
        {
            trigger: ".fmes-kpi-row",
            content: "The KPI row across the top",
        },
        {
            trigger: ".fmes-kpi-tile",
            content: "Each tile carries its value, trend and target",
        },
        {
            trigger: ".fmes-dashboard-grid",
            content: "Charts and tables below the KPIs",
        },
        {
            trigger: ".fmes-chart-container",
            content: "Production and productivity trends",
        },
        {
            trigger: ".fmes-dashboard-controls button",
            content: "Refresh re-reads the same period",
            run: "click",
        },
        {
            trigger: ".fmes-dashboard-toolbar",
            content: "Back on the dashboard after the refresh",
        },
        {
            trigger: ".o_fmes_alert_systray_btn",
            content: "The alert bell in the systray is always visible",
        },
    ],
});
