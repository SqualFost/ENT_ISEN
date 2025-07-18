import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-3 auto-rows-[120px] gap-4">
        {/* Card 1 */}
        <Card className="col-span-1">
          <CardHeader>1</CardHeader>
        </Card>

        {/* Card 2 */}
        <Card className="col-span-1"> 
          <CardHeader>2</CardHeader>
        </Card>

        {/* Card 3 */}
        <Card className="col-span-1 row-span-3">
          <CardHeader>3</CardHeader>
        </Card>

        {/* Card 4 */}
        <Card className="col-span-1">
          <CardHeader>4</CardHeader>
        </Card>

        {/* Card 5 */}
        <Card className="col-span-1">
          <CardHeader>5</CardHeader>
        </Card>

        {/* Card 6 */}
        <Card className="col-span-2 row-span-3">
          <CardHeader>6</CardHeader>
        </Card>

        {/* Card 7 */}
        <Card className="col-span-1 row-span-2">
          <CardHeader>7</CardHeader>
        </Card>
      </div>
    </>
  );
}
