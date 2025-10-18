import {parseAsInteger, parseAsString, useQueryStates, parseAsStringEnum} from "nuqs";

import { DEFAULT_PAGE } from "@/constants";
import { MeetingStatus } from "../types";
import { object } from "zod";


export const useMeetingsFilters = () => {
    return useQueryStates({
        Search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentId: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
    });
};