import React from "react";
import { Nav, Tab } from "react-bootstrap";
import { NavItem, NavLink, TabsWrap } from "@/shared/components/Tabs";
import { BorderedBottomTabs } from "@/shared/components/Tabs";
import { PanelTabs } from "../product/styled";
import { useTranslation } from "react-i18next";
import { colorText } from "@/utils/palette";

const ProductTabs = () => {
    const { t, i18n } = useTranslation(["common", "errors", "store"]);
    const language = i18n.language;

    const tabContent = {
        en: {
            notice: (
                <>
                    For any inquiries, please contact us at{" "}
                    <span style={{ color: colorText, fontWeight: "bold" }}>
                        093723XXXX
                    </span>
                    . Our support team is available to assist you with all
                    questions and concerns.
                </>
            ),
            delivery: (
                <>
                    Your order will be delivered within{" "}
                    <span style={{ color: colorText, fontWeight: "bold" }}>
                        3-5 business days
                    </span>
                    . We strive to ensure timely and safe delivery right to your
                    doorstep.
                </>
            ),
            refund: (
                <>
                    Enjoy a{" "}
                    <span style={{ color: colorText, fontWeight: "bold" }}>
                        3-day free return policy
                    </span>
                    . You may return the item within 3 days of receipt if you're
                    not completely satisfied.
                </>
            ),
        },
        vn: {
            notice: (
                <>
                    Mọi vấn đề xin liên hệ số điện thoại{" "}
                    <span style={{ color: colorText, fontWeight: "bold" }}>
                        093723XXXX
                    </span>
                    . Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn giải đáp
                    mọi thắc mắc.
                </>
            ),
            delivery: (
                <>
                    Đơn hàng sẽ giao đến bạn trong{" "}
                    <span style={{ color: colorText, fontWeight: "bold" }}>
                        3-5 ngày làm việc
                    </span>
                    . Chúng tôi cam kết giao hàng đúng hạn và an toàn đến tận
                    tay bạn.
                </>
            ),
            refund: (
                <>
                    Chính sách trả hàng{" "}
                    <span style={{ color: colorText, fontWeight: "bold" }}>
                        miễn phí trong 3 ngày
                    </span>
                    . Bạn có thể trả lại sản phẩm trong vòng 3 ngày nếu không
                    hài lòng.
                </>
            ),
        },
    };

    return (
        <BorderedBottomTabs>
            <PanelTabs>
                <Tab.Container defaultActiveKey="1">
                    <TabsWrap>
                        <Nav className="nav-tabs">
                            <NavItem>
                                <NavLink eventKey="1">
                                    {language === "en" ? "Notice" : "Thông báo"}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink eventKey="2">
                                    {language === "en"
                                        ? "Delivery"
                                        : "Giao hàng"}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink eventKey="3">
                                    {language === "en" ? "Refunds" : "Trả hàng"}
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <Tab.Content className="typography-message">
                            <Tab.Pane eventKey="1">
                                <p>{tabContent[language].notice}</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="2">
                                <p>{tabContent[language].delivery}</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="3">
                                <p>{tabContent[language].refund}</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </TabsWrap>
                </Tab.Container>
            </PanelTabs>
        </BorderedBottomTabs>
    );
};

export default ProductTabs;
