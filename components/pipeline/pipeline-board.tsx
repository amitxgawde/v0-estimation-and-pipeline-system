"use client"

import { useEffect, useState } from "react"
import { PipelineColumn } from "./pipeline-column"
import { PipelineCardDetail } from "./pipeline-card-detail"

export interface PipelineCard {
  id: string
  customer?: string
  email?: string
  estimateId?: string
  amount?: number
  date?: string
  notes?: string
  revisions?: number
}

export interface PipelineStage {
  id: string
  name: string
  color: string
  cards: PipelineCard[]
}

const defaultStages: PipelineStage[] = [
  { id: "new", name: "New Estimate Sent", color: "bg-info", cards: [] },
  { id: "negotiating", name: "Customer Negotiating", color: "bg-warning", cards: [] },
  { id: "accepted", name: "Customer Accepted", color: "bg-success", cards: [] },
  { id: "rejected", name: "Customer Rejected", color: "bg-destructive", cards: [] },
  { id: "confirmed", name: "Order Confirmed", color: "bg-chart-4", cards: [] },
  { id: "processing", name: "Order Processing", color: "bg-primary", cards: [] },
  { id: "completed", name: "Completed", color: "bg-muted-foreground", cards: [] },
]

export function PipelineBoard() {
  const [stages, setStages] = useState<PipelineStage[]>(defaultStages)
  const [selectedCard, setSelectedCard] = useState<PipelineCard | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/pipeline", { cache: "no-store" })
        const data = await res.json()
        if (data.pipeline && data.pipeline.length) {
          setStages(data.pipeline)
        } else {
          setStages(defaultStages)
        }
      } catch (err) {
        console.error("Failed to load pipeline", err)
        setStages(defaultStages)
      }
    }
    load()
  }, [])

  const persist = async (next: PipelineStage[]) => {
    try {
      await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      })
    } catch (err) {
      console.error("Failed to persist pipeline", err)
    }
  }

  const handleCardClick = (card: PipelineCard, stageId: string) => {
    setSelectedCard(card)
    setSelectedStage(stageId)
  }

  const handleMoveCard = (cardId: string, fromStageId: string, toStageId: string) => {
    setStages((prevStages) => {
      const newStages = prevStages.map((s) => ({ ...s, cards: [...s.cards] }))
      const fromStage = newStages.find((s) => s.id === fromStageId)
      const toStage = newStages.find((s) => s.id === toStageId)

      if (!fromStage || !toStage) return prevStages

      const cardIndex = fromStage.cards.findIndex((c) => c.id === cardId)
      if (cardIndex === -1) return prevStages

      const [card] = fromStage.cards.splice(cardIndex, 1)
      toStage.cards.push(card)

      persist(newStages)
      return newStages
    })
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            onCardClick={handleCardClick}
            onMoveCard={handleMoveCard}
            allStages={stages}
          />
        ))}
      </div>

      {selectedCard && selectedStage && (
        <PipelineCardDetail
          card={selectedCard}
          stageId={selectedStage}
          stages={stages}
          onClose={() => {
            setSelectedCard(null)
            setSelectedStage(null)
          }}
          onMove={(toStageId) => {
            handleMoveCard(selectedCard.id, selectedStage, toStageId)
            setSelectedStage(toStageId)
          }}
        />
      )}
    </>
  )
}
