enum OrderItemAction {
    Delete,
    Archive,
    Unarchive,
}

const OrderItemConfirmMessage = {
    [OrderItemAction.Delete]: "slette denne bestilling",
    [OrderItemAction.Archive]: "flytte denne bestilling til arkivet",
    [OrderItemAction.Unarchive]: "flytte denne bestilling ud af arkivet",
};

const OrderItemErrorMessage = {
    [OrderItemAction.Delete]: "sletning",
    [OrderItemAction.Archive]: "flyttelse",
    [OrderItemAction.Unarchive]: "flyttelse",
};

const OrderItemSuccessMessage = {
    [OrderItemAction.Delete]: "slettet",
    [OrderItemAction.Archive]: "flyttet",
    [OrderItemAction.Unarchive]: "flyttet",
};

const OrderItemApiUrl = {
    [OrderItemAction.Delete]: "remove",
    [OrderItemAction.Archive]: "archive",
    [OrderItemAction.Unarchive]: "unarchive",
};
