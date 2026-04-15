import { Heart, Syringe, Baby, Brain, Bone, Flower2, Ear, Eye, } from 'lucide-react';
export const specialtiesMap = {
    'Cardiologie': {
        name: 'Cardiologie',
        icon: Heart,
        description: 'Cœur et système cardiovasculaire',
    },
    'Dermatologie': {
        name: 'Dermatologie',
        icon: Syringe,
        description: 'Peau et derme',
    },
    'Pédiatrie': {
        name: 'Pédiatrie',
        icon: Baby,
        description: 'Santé des enfants',
    },
    'Psychiatrie': {
        name: 'Psychiatrie',
        icon: Brain,
        description: 'Santé mentale',
    },
    'Psychologie': {
        name: 'Psychologie',
        icon: Brain,
        description: 'Bien-être psychologique',
    },
    'Orthopédie': {
        name: 'Orthopédie',
        icon: Bone,
        description: 'Os et articulations',
    },
    'Gynécologie': {
        name: 'Gynécologie',
        icon: Flower2,
        description: 'Santé des femmes',
    },
    'ORL': {
        name: 'ORL',
        icon: Ear,
        description: 'Oreille, Nez, Gorge',
    },
    'Ophtalmologie': {
        name: 'Ophtalmologie',
        icon: Eye,
        description: 'Santé oculaire',
    },
};
export function getSpecialtyIcon(specialty) {
    return specialtiesMap[specialty]?.icon || Heart;
}
export function getSpecialtyDescription(specialty) {
    return specialtiesMap[specialty]?.description || specialty;
}
