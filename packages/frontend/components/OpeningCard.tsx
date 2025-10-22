import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type OpeningViewModel, formatDate, stripHtmlTags, truncateText } from "@/lib/strapi-client";
import { Briefcase, MapPin, Calendar } from "lucide-react";

interface OpeningCardProps {
  opening: OpeningViewModel;
}

export default function OpeningCard({ opening }: OpeningCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">{opening.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">{opening.positionType}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {opening.status && (
              <Badge variant={opening.status === 'Open' ? 'default' : 'destructive'}>
                {opening.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {opening.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">地点：</span>
            <span>{opening.location}</span>
          </div>
        )}
        {opening.deadlineDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">截止：</span>
            <span>{formatDate(opening.deadlineDate)}</span>
          </div>
        )}
        {opening.description && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {truncateText(stripHtmlTags(opening.description || ''), 140)}
            </p>
          </div>
        )}

        {opening.requirements && opening.requirements.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium">岗位要求</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {opening.requirements.map((req, idx) => (
                <li key={idx} className="text-sm">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {opening.benefits && opening.benefits.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium">福利待遇</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {opening.benefits.map((b, idx) => (
                <li key={idx} className="text-sm">{b}</li>
              ))}
            </ul>
          </div>
        )}

        {opening.researchAreas && opening.researchAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {opening.researchAreas.map((area) => (
              <Badge key={area.id} variant="outline" className="text-xs">{area.title}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {opening.applyLink && opening.status !== 'Closed' && (
          <Button variant="outline" size="sm" asChild>
            <Link href={opening.applyLink} target="_blank" rel="noopener noreferrer">立即申请</Link>
          </Button>
        )}
        {opening.contactEmail && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`mailto:${opening.contactEmail}`}>联系邮箱</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
