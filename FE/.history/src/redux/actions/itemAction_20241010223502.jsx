let accessToken = JSON.parse(localStorage.getItem("accessToken"));

export const fetchItems = (paraToken) => {
    const token = paraToken || accessToken;
    return async (dispatch) => {
        try {
            const response = await ItemService.getItems(token);

            dispatch(getItemsSuccess(response.data));
            return response;
        } catch (error) {
            dispatch(getItemsFailed(error.message));
            throw error;
        }
    };
};

export const addItem = (body) => {
    return async (dispatch) => {
        try {
            const response = await ItemService.postItem(body);

            await dispatch(fetchItems());

            return response;
        } catch (error) {
            dispatch(setItemError(error.message));
            throw error;
        }
    };
};

export const updateItem = (id, body) => {
    return async (dispatch) => {
        try {
            const response = await ItemService.putItem(id, body);
            await dispatch(fetchItems());
            return response;
        } catch (error) {
            dispatch(setItemError(error.message));
            throw error;
        }
    };
};

export const removeItem = (id) => {
    return async (dispatch) => {
        try {
            await ItemService.deleteItem(id);

            await dispatch(fetchItems());
            return "OK";
        } catch (error) {
            dispatch(setItemError(error.message));
            throw error;
        }
    };
};
