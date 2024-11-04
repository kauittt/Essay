import React from "react";
import { Nav, Tab } from "react-bootstrap";
import {
    NavItem,
    NavLink,
    Tabs as TabsWrapper,
    TabsWrap,
} from "@/shared/components/Tabs";
import { BorderedBottomTabs } from "../../../shared/components/Tabs";
import { PanelTabs } from "../product/styled";

//* Thông báo chung về ...
const ProductTabs = () => (
    <BorderedBottomTabs>
        <PanelTabs>
            <Tab.Container defaultActiveKey="1">
                <TabsWrap>
                    <Nav className="nav-tabs">
                        <NavItem>
                            <NavLink eventKey="1">Description</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink eventKey="2">Delivery</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink eventKey="3">Refunds</NavLink>
                        </NavItem>
                    </Nav>
                    <Tab.Content className="typography-message">
                        <Tab.Pane eventKey="1">
                            <p>
                                Direction has strangers now believing. Respect
                                enjoyed gay far exposed parlors towards.
                                Enjoyment use tolerably dependent listening men.
                                No peculiar in handsome together unlocked do by.
                                Article concern joy anxious did picture sir her.
                                Although desirous not recurred disposed off shy
                                you numerous securing. Knowledge nay estimable
                                questions repulsive daughters boy. Solicitude
                                gay way unaffected expression for.
                            </p>
                            <p>
                                His mistress ladyship required off horrible
                                disposed rejoiced. Unpleasing pianoforte
                                unreserved as oh he unpleasant no inquietude
                                insipidity. Advantages can discretion possession
                                add favourable cultivated admiration far.
                            </p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="2">
                            <p>
                                Direction has strangers now believing. Respect
                                enjoyed gay far exposed parlors towards.
                                Enjoyment use tolerably dependent listening men.
                                No peculiar in handsome together unlocked do by.
                            </p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="3">
                            <p>
                                His mistress ladyship required off horrible
                                disposed rejoiced. Unpleasing pianoforte
                                unreserved as oh he unpleasant no inquietude
                                insipidity. Advantages can discretion possession
                                add favourable cultivated admiration far.
                            </p>
                        </Tab.Pane>
                    </Tab.Content>
                </TabsWrap>
            </Tab.Container>
        </PanelTabs>
    </BorderedBottomTabs>
);

export default ProductTabs;
