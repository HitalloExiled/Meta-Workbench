export function dashedToCamel(value: string): string
{
    let parts = value.split("-");

    return parts.map
    (
        (item, index) =>
        {
            if (index == 0)
            {
                item = item.toLowerCase();
            }
            else
            {
                let [firstLetter, ...remaining] = item.split("");
                item = firstLetter.toUpperCase() + remaining.join("").toLowerCase();
            }
            
            return item;
        }
    )
    .join("");
}