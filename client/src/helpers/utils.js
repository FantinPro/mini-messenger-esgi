export const removeNullOrUndefinedField = (obj, values = []) =>
    Object.entries(obj).reduce((a, [k, v]) => ((v === null || v === undefined || values.includes(v) ) ? a : { ...a, [k]: v }), {});