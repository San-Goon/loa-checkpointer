import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useCharactersStore } from "@/store/characters";
import { useTokenStore } from "@/store/token";
import { useQueries } from "@tanstack/react-query";
import { getCharacterInfo } from "@/app/_lib/getCharacterInfo";
import { responseProcessor } from "@/lib/utils";
import Link from "next/link";
import { Fragment } from "react";

export default function TableBodySection() {
  const recognized = useCharactersStore((state) => state.recognized);
  const token = useTokenStore((state) => state.token);

  const queries = useQueries({
    queries: recognized.map((name) => ({
      queryKey: ["info", name],
      queryFn: () => getCharacterInfo(name, token),
      staleTime: 1 * 60 * 1000,
      gcTime: 3 * 60 * 1000,
    })),
  });

  return (
    <TableBody>
      {queries
        .map((query) => responseProcessor(query.data))
        .map((data, index) => {
          if (!data) return;
          console.log("data.gem", data.gem);
          return (
            <TableRow key={data.name}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.itemLv}</TableCell>
              <TableCell>{data.expLv}</TableCell>
              <TableCell>
                {data.engrave.buff}
                <span className="text-red-600">{data.engrave.deBuff}</span>
              </TableCell>
              <TableCell>{data.totalStats}</TableCell>
              <TableCell>
                <div>{data.weapon.level + "제"}</div>
                {data.weapon.quality}
              </TableCell>
              <TableCell>
                {GEM_MAP_ORDER.map((item) => {
                  if (data.gem[item])
                    return (
                      <Fragment key={item}>
                        {item}
                        {data.gem[item]}개{" "}
                      </Fragment>
                    );
                })}
              </TableCell>
              <TableCell>{data.tripod["5"]}</TableCell>
              <TableCell>{data.cardSet}</TableCell>
              <TableCell>
                <Link
                  href={`https://sasagefind.com/?who=${data.name}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GO!
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
    </TableBody>
  );
}

const GEM_MAP_ORDER = [
  "10멸",
  "9멸",
  "8멸",
  "7멸",
  "6멸",
  "5멸",
  "4멸",
  "3멸",
  "2멸",
  "1멸",
  "10홍",
  "9홍",
  "8홍",
  "7홍",
  "6홍",
  "5홍",
  "4홍",
  "3홍",
  "2홍",
  "1홍",
];
