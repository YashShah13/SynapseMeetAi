import {parseAsInteger, parseAsString, useQueryStates} from "nuqs";

import { DEFAULT_PAGE } from "@/constants";
import { Search } from "lucide-react";


export const useAgentsFilters = () => {
    return useQueryStates({
        Search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    })
};