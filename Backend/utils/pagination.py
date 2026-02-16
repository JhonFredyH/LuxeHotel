from typing import TypeVar, Generic, List
from pydantic import BaseModel
from math import ceil

T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Respuesta paginada genérica"""
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[T]


def paginate(query, page: int = 1, limit: int = 20):
    """
    Función helper para paginar queries de SQLAlchemy
    
    Args:
        query: SQLAlchemy query object
        page: Número de página (empieza en 1)
        limit: Cantidad de items por página
    
    Returns:
        dict con metadata de paginación y datos
    """
    # Validar parámetros
    if page < 1:
        page = 1
    if limit < 1:
        limit = 20
    if limit > 100:  # Límite máximo para evitar sobrecarga
        limit = 100
    
    # Contar total de items
    total = query.count()
    
    # Calcular offset
    offset = (page - 1) * limit
    
    # Obtener datos paginados
    data = query.offset(offset).limit(limit).all()
    
    # Calcular total de páginas
    total_pages = ceil(total / limit) if total > 0 else 1
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "data": data
    }