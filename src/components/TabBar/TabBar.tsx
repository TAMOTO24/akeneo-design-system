import React, {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import {AkeneoThemedProps, getColor, getFontSize} from '../../theme';
import {Dropdown, IconButton} from '../../components';
import {MoreIcon} from '../../icons';
import {useBooleanState} from '../../hooks';

const Container = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${getColor('grey', 80)};
`;

const TabBarContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 1;
  height: 44px;
  flex-wrap: wrap;
  overflow: hidden;
  margin-bottom: -1px;
`;

const TabContainer = styled.div<TabProps & AkeneoThemedProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 40px;
  color: ${({isActive}) => (isActive ? getColor('brand', 100) : getColor('grey', 100))};
  border-bottom: 3px solid ${({isActive}) => (isActive ? getColor('brand', 100) : 'transparent')};
  font-size: ${getFontSize('big')};
  cursor: pointer;
  white-space: nowrap;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    color: ${getColor('brand', 100)};
    border-bottom: 3px solid ${getColor('brand', 100)};
  }
`;

const HiddenTabsDropdown = styled(Dropdown)<{isActive: boolean} & AkeneoThemedProps>`
  border-bottom: 3px solid ${({isActive}) => (isActive ? getColor('brand', 100) : 'transparent')};
  margin-bottom: -1px;
  height: 44px;
  box-sizing: border-box;
  align-items: center;

  &:hover {
    color: ${getColor('brand', 100)};
    border-bottom: 3px solid ${getColor('brand', 100)};
  }
`;

type TabProps = {
  /**
   * Define if the tab is active.
   */
  isActive: boolean;

  /**
   * Function called when the user click on tab.
   */
  onClick?: () => void;

  /**
   * Content of the Tab.
   */
  children: ReactNode;

  /**
   * @private
   */
  parentRef?: RefObject<HTMLDivElement>;

  /**
   * @private
   */
  onVisibilityChange?: (newVisibility: boolean) => void;
};

const Tab = ({children, isActive, parentRef, onVisibilityChange, ...rest}: TabProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (undefined === parentRef) {
      throw new Error('TabBar.Tab can not be used outside TabBar');
    }

    const tabElement = ref.current;
    const tabBarElement = parentRef.current;

    /* istanbul ignore next first render */
    if (null === tabElement) return;

    const options = {
      root: tabBarElement,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(event => {
      onVisibilityChange?.(event[0].isIntersecting);
    }, options);

    observer.observe(tabElement);

    return () => {
      observer.unobserve(tabElement);
    };
  }, []);

  return (
    <TabContainer ref={ref} tabIndex={0} role="tab" aria-selected={isActive} isActive={isActive} {...rest}>
      {children}
    </TabContainer>
  );
};

type TabBarProps = {
  /**
   * Title of the More button.
   */
  moreButtonTitle: string;

  /**
   * Tabs of the Tab bar.
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * TabBar is used to move from one content to another within the same context.
 */
const TabBar = ({moreButtonTitle, children, ...rest}: TabBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hiddenElements, setHiddenElements] = useState<number[]>([]);
  const [isOpen, open, close] = useBooleanState();

  const decoratedChildren = Children.map(children, (child, index) => {
    if (!isValidElement<TabProps>(child)) {
      throw new Error('TabBar only accepts TabBar.Tab as children');
    }

    return cloneElement(child, {
      parentRef: ref,
      onVisibilityChange: (isVisible: boolean) => {
        setHiddenElements(previousHiddenElements =>
          isVisible
            ? previousHiddenElements.filter(hiddenElement => hiddenElement !== index)
            : [index, ...previousHiddenElements]
        );
      },
    });
  });

  const hiddenTabs = React.Children.toArray(decoratedChildren).filter(
    (child, index): child is ReactElement<TabProps> => isValidElement<TabProps>(child) && hiddenElements.includes(index)
  );

  const activeTabIsHidden = hiddenTabs.find(child => child.props.isActive) !== undefined;

  return (
    <Container>
      <TabBarContainer ref={ref} role="tablist" {...rest}>
        {decoratedChildren}
      </TabBarContainer>
      {0 < hiddenTabs.length && (
        <HiddenTabsDropdown isActive={activeTabIsHidden}>
          <IconButton level="tertiary" ghost="borderless" icon={<MoreIcon />} title={moreButtonTitle} onClick={open} />
          {isOpen && (
            <Dropdown.Overlay verticalPosition="down" onClose={close}>
              <Dropdown.ItemCollection>
                {hiddenTabs.map((child, index) => {
                  const handleClick = () => {
                    close();
                    child.props.onClick?.();
                  };

                  return (
                    <Dropdown.Item key={index} onClick={handleClick} isActive={child.props.isActive}>
                      {child.props.children}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.ItemCollection>
            </Dropdown.Overlay>
          )}
        </HiddenTabsDropdown>
      )}
    </Container>
  );
};

TabBar.Tab = Tab;

export {TabBar};