import { useEffect, useState } from 'react'

import axios from 'axios';

import  channels  from '@/api/axiosInstances'
import { useSelector } from 'react-redux';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

export function useMediaQuery(query: string) {

  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [matches, query]);

  return matches;
}


export function useCounter(count: number, step: number = 1) {

  const [counter, setCounter] = useState(count);

  const increment = () => { setCounter(counter + step); }
  const decrement = () => { setCounter(counter - step); }
  const reset = () => { setCounter(count); }

  return [counter, increment, decrement, reset];

}

type UseInput<T> = [T, (param: T) => void, (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void];

export function useInput<T>(initialValue: T): UseInput<T> {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as T);
  }

  return [value, setValue, onChange];
}

type UseDebance<T> = [T];

export function useDebance<T>(value: T, delay: number): UseDebance<T> {

  const [debanceValue, setDebanceValue] = useState<T>(value);

  useEffect(() => {

    const handler = setTimeout(() => {
      setDebanceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    }

  }, [value]);

  return [debanceValue];

}


export function  useRoomsSearch(query: string, pageNumber: number) {

  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState<any>([])
  const [hasMore, setHasMore] = useState(false)
  const id = useSelector((state: any) => state.auth.id);

  useEffect(() => {
    setRooms([])
  }, [query])


  useEffect(() => {
    if (!id) return;

    let cancel: any;
    setLoading(true)
    const URL = `/room/rooms/${id}/${pageNumber}${query.length ? '/' + query : ''}`;
    
   

    channels.get(URL, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {

      setHasMore(res.data.length > 0)
      setLoading(false)

      setRooms((prevRooms: any) => [...new Set([...prevRooms, ...res.data])])
    
    }).catch(e => {

      if (axios.isCancel(e)) return;
      
    })

    return () => cancel();

  }, [query, pageNumber, id])

  return [ loading, rooms, hasMore , setRooms]
}


