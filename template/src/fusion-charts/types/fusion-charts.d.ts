/* eslint-disable no-unused-vars */
import Vue from 'vue'

import { BarChart } from './cartesian/bar/bar-chart'

export interface InstallationOptions {}

export function install (vue: typeof Vue, options: InstallationOptions): void

export class IdssBarChart extends BarChart {}