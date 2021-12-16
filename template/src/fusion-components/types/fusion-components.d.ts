/* eslint-disable no-unused-vars */
import Vue from 'vue'

import { StaticFrame } from './commons/collapse/idss-static-frame'
import { Pagination } from './commons/idss-pagination'
import { Widget } from './commons/idss-widget'
import { IconSvg } from './commons/idss-icon-svg'
import { StepsView } from './commons/steps-views/idss-steps-view'
import { SelectTree } from './commons/idss-select-tree'
import { Collapse } from './commons/collapse/idss-collapse'
import { MultiTab } from './commons/idss-multi-tab'
import { InsertInput } from './commons/idss-insert-input'
import { Tooltip } from './commons/idss-tooltip'
import { DragContainer } from './commons/idss-drag-container'
import { TimeSelect } from './commons/time-select/idss-time-select'
import { Filters } from './commons/idss-filters'
import { SlideAside } from './commons/collapse/idss-slide-aside'
import { ContextMenu } from './commons/idss-context-menu'

export interface InstallationOptions {}

export function install (vue: typeof Vue, options: InstallationOptions): void

export class IdssStaticFrame extends StaticFrame {}
export class IdssPagination extends Pagination {}
export class IdssWidget extends Widget {}
export class IdssIconSvg extends IconSvg {}
export class IdssStepsView extends StepsView {}
export class IdssSelectTree extends SelectTree {}
export class IdssCollapse extends Collapse {}
export class IdssMultiTab extends MultiTab {}
export class IdssInsertInput extends InsertInput {}
export class IdssTooltip extends Tooltip {}
export class IdssDragContainer extends DragContainer {}
export class IdssTimeSelect extends TimeSelect {}
export class IdssFilters extends Filters {}
export class IdssSlideAside extends SlideAside {}
export class IdssContextMenu extends ContextMenu {}
