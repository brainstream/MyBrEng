import { createReducer, on } from "@ngrx/store";
import { ITagsState } from "./tags-state";
import { tagsActions } from "./tags-actions";
import { TagDto } from "@app/web-api";

export const tagsReducer = createReducer(
    createDefaultState(),

    on(tagsActions.setLoading, (state, { loading }) => ({
        ...state,
        loadingCounter: loading
            ? state.loadingCounter + 1
            : (state.loadingCounter <= 0 ? 0 : state.loadingCounter - 1)
    })),

    on(tagsActions.listLoaded, (state, { tags }) => ({
        ...state,
        list: prepareTagList(tags)
    })),

    on(tagsActions.tagSaved, (state, { tag }) => ({
        ...state,
        list: addOrChangeTag(state.list, tag)
    }))
);

function createDefaultState(): ITagsState {
    return {
        loadingCounter: 0,
        list: null
    };
}

function prepareTagList(students: TagDto[]): TagDto[] {
    return sortTagListInPlace([...students]);
}

function sortTagListInPlace(list: TagDto[]): TagDto[] {
    return list.sort((left, right) => left.name.toLowerCase() < right.name.toLowerCase() ? -1 : 1);
}

function addOrChangeTag(list: TagDto[] | null, student: TagDto): TagDto[] | null {
    if (list == null) {
        return null;
    }
    const idx = list.findIndex(s => s.id === student.id);
    if (idx < 0) {
        return [...list, student];
    }
    const result = [...list];
    result.splice(idx, 1, student);
    return sortTagListInPlace(result);
}
