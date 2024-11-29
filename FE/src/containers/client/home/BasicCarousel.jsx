import React from "react";
import CarouselMultiply from "@/shared/components/carousel/CarouselMultiply";
import {
    Card,
    CardBody,
    CardTitleWrap,
    CardTitle,
} from "@/shared/components/Card";
const BasicCarousel = ({ data }) => {
    return (
        <Card>
            <CardBody>
                <CarouselMultiply>
                    {data?.map((item) => (
                        <div key={item.id}>
                            <img src={item.src} alt={`slide_${item.src}`} />
                        </div>
                    ))}
                </CarouselMultiply>
            </CardBody>
        </Card>
    );
};

export default BasicCarousel;
