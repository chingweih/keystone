import { type HTMLAttributes, type ReactNode, useContext, useId, useState } from 'react'

import { ActionButton } from '@keystar/ui/button'
import { Icon } from '@keystar/ui/icon'
import { menuIcon } from '@keystar/ui/icon/icons/menuIcon'
import { panelLeftCloseIcon } from '@keystar/ui/icon/icons/panelLeftCloseIcon'
import { panelLeftOpenIcon } from '@keystar/ui/icon/icons/panelLeftOpenIcon'
import { xIcon } from '@keystar/ui/icon/icons/xIcon'
import { breakpointQueries, css, tokenSchema } from '@keystar/ui/style'
import { HStack, VStack } from '@keystar/ui/layout'

import { DesktopSidebarContext } from './DesktopSidebarContext.ts'
import { Logo } from './Logo.tsx'
import { Navigation } from './Navigation.tsx'

export function PageWrapper(props: HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateRows: `repeat(2, ${tokenSchema.size.element.large}) auto`,
        height: '100vh',
        isolation: 'isolate',
        [breakpointQueries.above.mobile]: {
          gridTemplateColumns: `${tokenSchema.size.scale[3600]} minmax(0, 1fr)`,
          gridTemplateRows: `${tokenSchema.size.element.xlarge} minmax(0, 1fr)`,
          '&[data-sidebar-collapsed] > main': {
            gridColumn: '1 / -1',
            gridRow: '2 / 3',
          },
        },
      })}
      {...props}
    />
  )
}

const Sidebar = ({
  isMobileMenuOpen,
  isDesktopSidebarCollapsed,
  ...props
}: HTMLAttributes<HTMLElement> & {
  isMobileMenuOpen: boolean
  isDesktopSidebarCollapsed: boolean
}) => {
  return (
    <div
      className={css({
        gridColumn: '1/2',
        gridRow: '2/4',
        display: isMobileMenuOpen ? 'block' : 'none',
        height: '100vh',
        overflow: 'hidden auto',
        WebkitOverflowScrolling: 'touch',

        [breakpointQueries.above.mobile]: {
          gridColumn: '1/2',
          gridRow: '2/3',
          display: isDesktopSidebarCollapsed ? 'none' : 'block',
          height: '100%',
        },
      })}
    >
      <aside
        className={css({
          minHeight: '100%',
          minWidth: 0, // resolves collapsing issues in children
        })}
        {...props}
      />
    </div>
  )
}

function Content(props: HTMLAttributes<HTMLElement>) {
  return (
    <VStack
      elementType="main"
      minHeight={0}
      minWidth={0}
      paddingX="xlarge"
      position="relative"
      UNSAFE_className={css({
        overflow: 'hidden auto',
        WebkitOverflowScrolling: 'touch',

        [breakpointQueries.above.mobile]: {
          gridColumn: '2 / 3',
          gridRow: '2 / 4',
          // Match the sticky toolbar height so it doesn't cover focused fields.
          scrollPaddingBlockEnd: tokenSchema.size.element.xlarge,
        },
      })}
      {...props}
    />
  )
}

type PageContainerProps = {
  children: ReactNode
  header: ReactNode
  title?: string
}

export function PageContainer({ children, header, title }: PageContainerProps) {
  const sidebarId = useId()
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] = useContext(
    DesktopSidebarContext
  ) ?? [false, null]

  return (
    <PageWrapper data-sidebar-collapsed={isDesktopSidebarCollapsed || undefined}>
      <title>{title ? `Keystone - ${title}` : 'Keystone'}</title>
      <HStack
        alignItems="center"
        borderBottom="neutral"
        justifyContent="space-between"
        paddingX="xlarge"
      >
        <Logo />
        <ActionButton
          aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
          aria-controls={sidebarId}
          aria-expanded={isMobileMenuOpen}
          onPress={() => setMobileMenuOpen(open => !open)}
          prominence="low"
          isHidden={{ above: 'mobile' }}
        >
          <Icon src={isMobileMenuOpen ? xIcon : menuIcon} />
        </ActionButton>
      </HStack>
      <HStack
        elementType="header"
        alignItems="center"
        borderBottom="neutral"
        gap="regular"
        justifyContent="space-between"
        minWidth={0}
        paddingX="xlarge"
        UNSAFE_className={css({
          [breakpointQueries.below.tablet]: {
            visibility: isMobileMenuOpen ? 'hidden' : 'visible',
          },
        })}
      >
        {header}
      </HStack>
      <Sidebar
        id={sidebarId}
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
      >
        <Navigation />
      </Sidebar>
      {setDesktopSidebarCollapsed && (
        <HStack
          alignItems="center"
          gridColumn="1 / 2"
          gridRow="3 / 4"
          height="element.large"
          isHidden={{ below: 'tablet' }}
          // Leave room for the Next.js development indicator in the corner.
          paddingStart={
            process.env.NODE_ENV === 'development' ? tokenSchema.size.scale[800] : 'large'
          }
        >
          <ActionButton
            aria-label={isDesktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-controls={sidebarId}
            aria-expanded={!isDesktopSidebarCollapsed}
            onPress={() => setDesktopSidebarCollapsed(collapsed => !collapsed)}
            prominence="low"
          >
            <Icon src={isDesktopSidebarCollapsed ? panelLeftOpenIcon : panelLeftCloseIcon} />
          </ActionButton>
        </HStack>
      )}
      <Content>{children}</Content>
    </PageWrapper>
  )
}
