"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MoveRight, FileText } from "lucide-react"
import type { PipelineCard, PipelineStage } from "./pipeline-board"

interface PipelineColumnProps {
  stage: PipelineStage
  onCardClick: (card: PipelineCard, stageId: string) => void
  onMoveCard: (cardId: string, fromStageId: string, toStageId: string) => void
  allStages: PipelineStage[]
}

export function PipelineColumn({ stage, onCardClick, onMoveCard, allStages }: PipelineColumnProps) {
  const totalValue = stage.cards.reduce((sum, card) => {
    const amount = Number.parseFloat(card.amount.replace(/[$,]/g, ""))
    return sum + amount
  }, 0)

  return (
    <div className="flex w-72 flex-shrink-0 flex-col">
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
          <h3 className="text-sm font-medium text-foreground">{stage.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {stage.cards.length}
          </Badge>
        </div>
      </div>

      {/* Column Value */}
      <div className="mb-3 text-xs text-muted-foreground">{totalValue.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2">
        {stage.cards.map((card) => (
          <Card
            key={card.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => onCardClick(card, stage.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{card.estimateId}</span>
                  {card.revisions > 0 && <span className="text-xs text-muted-foreground">v{card.revisions + 1}</span>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {allStages
                      .filter((s) => s.id !== stage.id)
                      .map((targetStage) => (
                        <DropdownMenuItem
                          key={targetStage.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveCard(card.id, stage.id, targetStage.id)
                          }}
                        >
                          <MoveRight className="mr-2 h-4 w-4" />
                          Move to {targetStage.name}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h4 className="text-sm font-medium text-foreground mb-1">{card.customer}</h4>
              <p className="text-xs text-muted-foreground mb-3">{card.email}</p>

              {card.notes && (
                <p className="text-xs text-muted-foreground bg-secondary rounded px-2 py-1 mb-3 line-clamp-2">
                  {card.notes}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{card.amount}</span>
                <span className="text-xs text-muted-foreground">{card.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {stage.cards.length === 0 && (
          <div className="flex-1 rounded-lg border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">No deals in this stage</p>
          </div>
        )}
      </div>
    </div>
  )
}
