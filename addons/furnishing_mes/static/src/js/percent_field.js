/** @odoo-module **/
/**
 * Read-only percentage widget for fields that already hold 0-100.
 *
 * Odoo's stock `percentage` widget expects a FRACTION (0.6 -> "60%") and
 * multiplies by 100. Every `*_pct` field in this module is computed as
 * `x / y * 100.0`, so the stock widget shows 60 as "6000%". This widget
 * prints the stored value as-is with a trailing "%". The three OEE factors
 * (availability / performance / quality) really are fractions and keep the
 * stock widget.
 */

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

export class FmesPercentField extends Component {
    static template = "furnishing_mes.FmesPercentField";
    static props = { ...standardFieldProps };

    get formattedValue() {
        const value = this.props.record.data[this.props.name];
        if (value === false || value === null || value === undefined) {
            return "";
        }
        return `${Number(value).toFixed(1)}%`;
    }
}

export const fmesPercentField = {
    component: FmesPercentField,
    displayName: "Percentage (0-100)",
    supportedTypes: ["float"],
};

registry.category("fields").add("fmes_pct", fmesPercentField);
