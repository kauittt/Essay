import BannerService from "../../services/BannerService";
import { getBannersSuccess } from "../reducers/bannerSlice";

export const fetchBanners = (paraToken) => {
    let accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await BannerService.getBanners(token);
            dispatch(getBannersSuccess(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const addBanner = (body) => {
    return async (dispatch) => {
        try {
            const response = await BannerService.postBanner(body);

            await dispatch(fetchBanners());

            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const updateBanner = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await BannerService.putBanner(id, body);
            await dispatch(fetchBanners());
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export const removeBanner = (id) => {
    return async (dispatch) => {
        try {
            await BannerService.deleteBanner(id);

            await dispatch(fetchBanners());
            return "OK";
        } catch (error) {
            throw error;
        }
    };
};
