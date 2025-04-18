import { useEffect, useState } from "react";
import { getTagsWithQuestionNumber } from "../services/tagService";
import { TagResponseType } from "../types/entityTypes";

/**
 * The custom hook to handle the state and logic for fetching tags with the number of questions associated with each tag.
 * The interacts with the tags service.
 * @returns the list of tags with the number of questions associated with each tag
 */
export const useTagPage = () => {
  const [tlist, setTlist] = useState<TagResponseType[]>([]);

  /**
   * the effect interacts with the tag service to fetch the tags with the number of questions associated with each tag.
   * 
   * It has no dependencies and runs only once when the component renders.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagsWithQuestionNumber();
        setTlist(res || []);
      } catch (e) {
        console.error("Error fetching tags:", e);
      }
    };

    fetchData();
  }, []);

  return { tlist };
};
