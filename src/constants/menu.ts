import CalIcon from '@/icons/cal-icon'
import ChatIcon from '@/icons/chat-icon'
import DashboardIcon from '@/icons/dashboard-icon'
import EmailIcon from '@/icons/email-icon'
import HelpDeskIcon from '@/icons/help-desk-icon'
import IntegrationsIcon from '@/icons/integrations-icon'
import SettingsIcon from '@/icons/settings-icon'
import StarIcon from '@/icons/star-icon'
import TimerIcon from '@/icons/timer-icon'

type SIDE_BAR_MENU_PROPS = {
  label: string
  icon: () => JSX.Element
  path: string
}

export const SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    path: 'admin/dashboard',
  },
  {
    label: 'Email',
    icon: EmailIcon,
    path: 'admin/email',
  },
  {
    label: 'Notification',
    icon: IntegrationsIcon,
    path: 'admin/notification',
  },
  {
    label: 'Data',
    icon: SettingsIcon,
    path: 'admin/data',
  },
  {
    label: 'App',
    icon: CalIcon,
    path: 'admin/app',
  },
  {
    label: 'Model',
    icon: EmailIcon,
    path: 'admin/model',
  },
]

type TABS_MENU_PROPS = {
  label: string
  icon?: string
}

export const TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'unread',
    icon: EmailIcon,
  },
  {
    label: 'all',
    icon: EmailIcon,
  },
  {
    label: 'expired',
    icon: TimerIcon,
  },
  {
    label: 'starred',
    icon: StarIcon,
  },
]

export const HELP_DESK_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'help desk',
  },
  {
    label: 'questions',
  },
]

export const APPOINTMENT_TABLE_HEADER = [
  'Name',
  'RequestedTime',
  'Added Time',
  'Domain',
]

export const EMAIL_MARKETING_HEADER = ['Id', 'Email', 'Answers', 'Domain']

export const BOT_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'chat',
    icon: ChatIcon,
  },
  {
    label: 'helpdesk',
    icon: HelpDeskIcon,
  },
]
